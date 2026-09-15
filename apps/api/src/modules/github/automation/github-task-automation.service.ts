import { Injectable, Logger } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { schema } from '@devflow/db';

import { DatabaseService } from '../../../database/database.service.js';
import { ActivityLogsService } from '../../activity-logs/activity-logs.service.js';
import { RealtimeGateway } from '../../realtime/realtime.gateway.js';
import { GithubNotificationService } from '../notifications/github-notification.service.js';

type GithubAutomationSource =
  | {
      type: 'PULL_REQUEST';
      id: string;
      githubId: number;
      number: number;
      title: string;
    }
  | {
      type: 'ISSUE';
      id: string;
      githubId: number;
      number: number;
      title: string;
    };

@Injectable()
export class GithubTaskAutomationService {
  private readonly logger = new Logger(GithubTaskAutomationService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly activityLogsService: ActivityLogsService,
    private readonly realtimeGateway: RealtimeGateway,
    private readonly githubNotificationService: GithubNotificationService,
  ) {}

  private get db() {
    return this.databaseService.db;
  }

  async handlePullRequestChange(pullRequestId: string, action: string) {
    const [pullRequest] = await this.db
      .select()
      .from(schema.githubPullRequests)
      .where(eq(schema.githubPullRequests.id, pullRequestId))
      .limit(1);

    if (!pullRequest) {
      return;
    }

    const links = await this.db
      .select({
        taskId: schema.taskGithubPullRequests.taskId,
      })
      .from(schema.taskGithubPullRequests)
      .where(eq(schema.taskGithubPullRequests.pullRequestId, pullRequestId));

    if (links.length === 0) {
      return;
    }

    const source: GithubAutomationSource = {
      type: 'PULL_REQUEST',
      id: pullRequest.id,
      githubId: pullRequest.githubPullRequestId,
      number: pullRequest.githubNumber,
      title: pullRequest.title,
    };

    for (const link of links) {
      await this.processTask(link.taskId, source, action);
    }
  }

  async handleIssueChange(issueId: string, action: string) {
    const [issue] = await this.db
      .select()
      .from(schema.githubIssues)
      .where(eq(schema.githubIssues.id, issueId))
      .limit(1);

    if (!issue) {
      return;
    }

    const links = await this.db
      .select({
        taskId: schema.taskGithubIssues.taskId,
      })
      .from(schema.taskGithubIssues)
      .where(eq(schema.taskGithubIssues.issueId, issueId));

    if (links.length === 0) {
      return;
    }

    const source: GithubAutomationSource = {
      type: 'ISSUE',
      id: issue.id,
      githubId: issue.githubIssueId,
      number: issue.githubNumber,
      title: issue.title,
    };

    for (const link of links) {
      await this.processTask(link.taskId, source, action);
    }
  }

  private async processTask(
    taskId: string,
    source: GithubAutomationSource,
    action: string,
  ) {
    const [task] = await this.db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, taskId))
      .limit(1);

    if (!task) {
      return;
    }

    if (task.archivedAt) {
      return;
    }

    await this.activityLogsService.create({
      organizationId: task.organizationId,
      projectId: task.projectId,
      actorId: null,

      action:
        source.type === 'PULL_REQUEST'
          ? 'TASK_LINKED_GITHUB_PR_UPDATED'
          : 'TASK_LINKED_GITHUB_ISSUE_UPDATED',

      entityType: 'TASK',
      entityId: task.id,

      metadata: {
        source: 'GITHUB',
        githubEntityType: source.type,
        githubEntityId: source.id,
        githubId: source.githubId,
        githubNumber: source.number,
        title: source.title,
        githubAction: action,
      },
    });

    const completionCandidate = action === 'closed';

    if (!completionCandidate) {
      await this.githubNotificationService.notifyLinkedTaskUsers(
        task,
        source,
        action,
        false,
      );

      this.emitGithubTaskActivity(task, source, action);

      return;
    }

    if (source.type === 'PULL_REQUEST') {
      const [pullRequest] = await this.db
        .select({
          merged: schema.githubPullRequests.merged,
        })
        .from(schema.githubPullRequests)
        .where(eq(schema.githubPullRequests.id, source.id))
        .limit(1);

      if (!pullRequest?.merged) {
        await this.githubNotificationService.notifyLinkedTaskUsers(
          task,
          source,
          action,
          false,
        );

        this.emitGithubTaskActivity(task, source, action);

        return;
      }
    }

    if (task.status === 'DONE') {
      await this.githubNotificationService.notifyLinkedTaskUsers(
        task,
        source,
        action,
        false,
      );

      this.emitGithubTaskActivity(task, source, action);

      return;
    }

    const hasOpenGithubWork = await this.hasOpenGithubWork(task.id);

    if (hasOpenGithubWork) {
      this.logger.log(
        `Task ${task.id} not completed: linked GitHub work is still open`,
      );

      await this.githubNotificationService.notifyLinkedTaskUsers(
        task,
        source,
        action,
        false,
      );

      this.emitGithubTaskActivity(task, source, action);

      return;
    }

    const completedAt = new Date();

    const [updatedTask] = await this.db
      .update(schema.tasks)
      .set({
        status: 'DONE',
        completedAt,
        updatedAt: completedAt,
      })
      .where(
        and(
          eq(schema.tasks.id, task.id),
          eq(schema.tasks.organizationId, task.organizationId),
          eq(schema.tasks.projectId, task.projectId),
        ),
      )
      .returning();

    if (!updatedTask) {
      return;
    }

    const activity = await this.activityLogsService.create({
      organizationId: task.organizationId,
      projectId: task.projectId,
      actorId: null,
      action: 'TASK_STATUS_CHANGED',
      entityType: 'TASK',
      entityId: task.id,

      metadata: {
        source: 'GITHUB',
        from: task.status,
        to: 'DONE',
        githubEntityType: source.type,
        githubEntityId: source.id,
        githubId: source.githubId,
        githubNumber: source.number,
        githubAction: action,
        automatic: true,
      },
    });

    this.realtimeGateway.emitToProject(
      task.organizationId,
      task.projectId,
      'task:updated',
      {
        task: updatedTask,
        actorId: null,
        source: 'GITHUB',
        automatic: true,

        github: {
          type: source.type,
          id: source.id,
          githubId: source.githubId,
          number: source.number,
          action,
        },

        activityId: activity.id,
      },
    );

    await this.githubNotificationService.notifyLinkedTaskUsers(
      updatedTask,
      source,
      action,
      true,
    );

    this.logger.log(
      `Task ${task.id} automatically completed from GitHub ${source.type} #${source.number}`,
    );
  }

  private async hasOpenGithubWork(taskId: string) {
    const pullRequests = await this.db
      .select({
        state: schema.githubPullRequests.state,
        merged: schema.githubPullRequests.merged,
      })
      .from(schema.taskGithubPullRequests)
      .innerJoin(
        schema.githubPullRequests,
        eq(
          schema.taskGithubPullRequests.pullRequestId,
          schema.githubPullRequests.id,
        ),
      )
      .where(eq(schema.taskGithubPullRequests.taskId, taskId));

    const issues = await this.db
      .select({
        state: schema.githubIssues.state,
      })
      .from(schema.taskGithubIssues)
      .innerJoin(
        schema.githubIssues,
        eq(schema.taskGithubIssues.issueId, schema.githubIssues.id),
      )
      .where(eq(schema.taskGithubIssues.taskId, taskId));

    const hasOpenPullRequest = pullRequests.some(
      (pullRequest) => !pullRequest.merged && pullRequest.state !== 'closed',
    );

    const hasOpenIssue = issues.some((issue) => issue.state !== 'closed');

    return hasOpenPullRequest || hasOpenIssue;
  }

  private emitGithubTaskActivity(
    task: typeof schema.tasks.$inferSelect,
    source: GithubAutomationSource,
    action: string,
  ) {
    this.realtimeGateway.emitToProject(
      task.organizationId,
      task.projectId,
      'task:github_updated',
      {
        taskId: task.id,
        source: 'GITHUB',

        github: {
          type: source.type,
          id: source.id,
          githubId: source.githubId,
          number: source.number,
          title: source.title,
          action,
        },
      },
    );
  }
}
