import { Injectable, Logger } from '@nestjs/common';
import { schema } from '@devflow/db';

import { NotificationsService } from '../../notifications/notifications.service.js';

type GithubNotificationSource =
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

type Task = typeof schema.tasks.$inferSelect;

@Injectable()
export class GithubNotificationService {
  private readonly logger = new Logger(GithubNotificationService.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  async notifyLinkedTaskUsers(
    task: Task,
    source: GithubNotificationSource,
    action: string,
    taskAutomaticallyCompleted = false,
  ) {
    const notification = this.buildNotification(
      task,
      source,
      action,
      taskAutomaticallyCompleted,
    );

    if (!notification) {
      return;
    }

    /*
     * Reporter + assignee are the initial recipients.
     *
     * Set automatically removes duplicates when reporter
     * and assignee are the same user.
     */
    const recipientIds = new Set<string>();

    recipientIds.add(task.reporterId);

    if (task.assigneeId) {
      recipientIds.add(task.assigneeId);
    }

    for (const userId of recipientIds) {
      await this.notificationsService.create({
        organizationId: task.organizationId,

        userId,

        type: 'GENERAL',

        title: notification.title,

        message: notification.message,

        entityType: 'TASK',

        entityId: task.id,

        metadata: {
          source: 'GITHUB',

          githubEvent: notification.event,

          githubEntityType: source.type,

          githubEntityId: source.id,

          githubId: source.githubId,

          githubNumber: source.number,

          githubTitle: source.title,

          githubAction: action,

          taskId: task.id,

          projectId: task.projectId,

          taskAutomaticallyCompleted,
        },
      });
    }

    this.logger.log(
      `GitHub notification ${notification.event} created for task=${task.id} recipients=${recipientIds.size}`,
    );
  }

  private buildNotification(
    task: Task,
    source: GithubNotificationSource,
    action: string,
    taskAutomaticallyCompleted: boolean,
  ) {
    /*
     * Automatic completion is the highest-value event.
     * We create one notification instead of another
     * "Issue closed / PR merged" notification.
     */
    if (taskAutomaticallyCompleted) {
      if (source.type === 'PULL_REQUEST') {
        return {
          event: 'TASK_COMPLETED_FROM_GITHUB_PR',

          title: 'Task completed from GitHub',

          message:
            `Task "${task.title}" was automatically completed ` +
            `after pull request #${source.number} was merged.`,
        };
      }

      return {
        event: 'TASK_COMPLETED_FROM_GITHUB_ISSUE',

        title: 'Task completed from GitHub',

        message:
          `Task "${task.title}" was automatically completed ` +
          `after issue #${source.number} was closed.`,
      };
    }

    /*
     * Only meaningful GitHub lifecycle events generate
     * notifications. Routine edits/synchronization remain
     * Activity Log + realtime events only.
     */

    if (source.type === 'PULL_REQUEST') {
      if (action === 'reopened') {
        return {
          event: 'GITHUB_PR_REOPENED',

          title: `Pull request #${source.number} reopened`,

          message:
            `Pull request #${source.number} "${source.title}" ` +
            `linked to task "${task.title}" was reopened.`,
        };
      }

      /*
       * A closed PR is only interesting here when the task
       * wasn't automatically completed.
       *
       * The automation service determines whether it was
       * actually merged.
       */
      if (action === 'closed') {
        return {
          event: 'GITHUB_PR_CLOSED',

          title: `Pull request #${source.number} closed`,

          message:
            `Pull request #${source.number} "${source.title}" ` +
            `linked to task "${task.title}" was closed.`,
        };
      }

      return null;
    }

    if (action === 'reopened') {
      return {
        event: 'GITHUB_ISSUE_REOPENED',

        title: `GitHub issue #${source.number} reopened`,

        message:
          `Issue #${source.number} "${source.title}" ` +
          `linked to task "${task.title}" was reopened.`,
      };
    }

    if (action === 'closed') {
      return {
        event: 'GITHUB_ISSUE_CLOSED',

        title: `GitHub issue #${source.number} closed`,

        message:
          `Issue #${source.number} "${source.title}" ` +
          `linked to task "${task.title}" was closed.`,
      };
    }

    return null;
  }
}
