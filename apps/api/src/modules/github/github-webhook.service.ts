import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { createHmac, timingSafeEqual } from 'node:crypto';

import { GithubService } from './github.service.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';
import { GithubEntityPersistenceService } from './persistence/github-entity-persistence.service.js';
import { GithubTaskAutomationService } from './automation/github-task-automation.service.js';

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type GithubInstallationRepositoriesPayload = {
  action: 'added' | 'removed';

  installation: {
    id: number;
  };

  repositories_added?: Array<{
    id: number;
    name: string;
    full_name: string;
  }>;

  repositories_removed?: Array<{
    id: number;
    name: string;
    full_name: string;
  }>;
};

type GithubInstallationPayload = {
  action: string;

  installation: {
    id: number;

    account?: {
      id?: number;
      login?: string;
      type?: string;
    };

    repository_selection?: string;
  };

  sender?: {
    id?: number;
    login?: string;
  };
};

type GithubPushPayload = {
  ref: string;
  before: string;
  after: string;

  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
  };

  installation?: {
    id: number;
  };

  pusher?: {
    name?: string;
    email?: string;
  };

  sender?: {
    login?: string;
    id?: number;
  };

  commits?: Array<{
    id: string;
    message: string;
    timestamp: string;
    url: string;

    author?: {
      name?: string;
      email?: string;
    };
  }>;
};

type GithubPullRequestPayload = {
  action:
    | 'opened'
    | 'closed'
    | 'reopened'
    | 'synchronize'
    | 'edited'
    | 'ready_for_review'
    | 'converted_to_draft'
    | string;

  number: number;

  installation?: {
    id: number;
  };

  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
  };

  sender?: {
    id?: number;
    login?: string;
  };

  pull_request: {
    id: number;
    number: number;
    title: string;
    body?: string | null;
    state: string;

    draft?: boolean;
    merged?: boolean;
    merged_at?: string | null;

    created_at?: string;
    updated_at?: string;
    closed_at?: string | null;

    html_url: string;

    user?: {
      id?: number;
      login?: string;
    };

    head?: {
      ref?: string;
      sha?: string;
    };

    base?: {
      ref?: string;
      sha?: string;
    };

    // GitHub PR statistics
    additions?: number;
    deletions?: number;
    changed_files?: number;
    commits?: number;
    comments?: number;
    review_comments?: number;
  };
};

type GithubIssuePayload = {
  action: string;

  installation?: {
    id: number;
  };

  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
  };

  sender?: {
    id?: number;
    login?: string;
  };

  issue: {
    id: number;
    number: number;
    title: string;
    body?: string | null;
    state: string;
    state_reason?: string | null;
    html_url: string;

    user?: {
      id?: number;
      login?: string;
    };

    assignee?: {
      id?: number;
      login?: string;
    } | null;

    assignees?: Array<{
      id?: number;
      login?: string;
    }>;

    labels?: Array<{
      id?: number;
      name?: string;
      color?: string;
    }>;

    created_at?: string;
    updated_at?: string;
    closed_at?: string | null;
  };
};

type GithubIssueCommentPayload = {
  action: 'created' | 'edited' | 'deleted' | string;

  installation?: {
    id: number;
  };

  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
  };

  sender?: {
    id?: number;
    login?: string;
  };

  issue: {
    id: number;
    number: number;
    title: string;
    state: string;
    html_url: string;

    pull_request?: {
      url?: string;
      html_url?: string;
    };
  };

  comment: {
    id: number;
    body?: string | null;
    html_url: string;

    user?: {
      id?: number;
      login?: string;
    };

    created_at?: string;
    updated_at?: string;
  };
};

type GithubPullRequestReviewPayload = {
  action: 'submitted' | 'edited' | 'dismissed' | string;

  installation?: {
    id: number;
  };

  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
  };

  sender?: {
    id?: number;
    login?: string;
  };

  pull_request: {
    id: number;
    number: number;
    title: string;
    state: string;
    html_url: string;

    user?: {
      id?: number;
      login?: string;
    };
  };

  review: {
    id: number;
    body?: string | null;
    state: string;
    html_url?: string | null;
    commit_id?: string | null;
    submitted_at?: string | null;

    user?: {
      id?: number;
      login?: string;
    };
  };
};

type GithubPullRequestReviewCommentPayload = {
  action: 'created' | 'edited' | 'deleted' | string;

  installation?: {
    id: number;
  };

  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
  };

  sender?: {
    id?: number;
    login?: string;
  };

  pull_request: {
    id: number;
    number: number;
    title: string;
    state: string;
    html_url: string;

    user?: {
      id?: number;
      login?: string;
    };
  };

  comment: {
    id: number;

    pull_request_review_id?: number | null;

    body?: string | null;

    path: string;

    line?: number | null;
    original_line?: number | null;

    start_line?: number | null;
    original_start_line?: number | null;

    side?: string | null;
    start_side?: string | null;

    commit_id?: string | null;
    original_commit_id?: string | null;

    diff_hunk?: string | null;

    html_url?: string | null;

    created_at?: string | null;
    updated_at?: string | null;

    user?: {
      id?: number;
      login?: string;
    };
  };
};

/* -------------------------------------------------------------------------- */
/*                                  SERVICE                                   */
/* -------------------------------------------------------------------------- */

@Injectable()
export class GithubWebhookService {
  private readonly logger = new Logger(GithubWebhookService.name);

  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly githubService: GithubService,
    private readonly activityLogsService: ActivityLogsService,
    private readonly realtimeGateway: RealtimeGateway,
    private readonly githubEntityPersistenceService: GithubEntityPersistenceService,
    private readonly githubTaskAutomationService: GithubTaskAutomationService,
  ) {
    const webhookSecret = this.configService.get<string>(
      'GITHUB_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      throw new Error('GITHUB_WEBHOOK_SECRET is not configured');
    }

    this.webhookSecret = webhookSecret;
  }

  /* ------------------------------------------------------------------------ */
  /*                           SIGNATURE VERIFICATION                         */
  /* ------------------------------------------------------------------------ */

  verifySignature(rawBody: Buffer, signature: string | undefined): void {
    if (!signature) {
      throw new UnauthorizedException('Missing GitHub webhook signature');
    }

    if (!signature.startsWith('sha256=')) {
      throw new UnauthorizedException(
        'Invalid GitHub webhook signature format',
      );
    }

    const expectedSignature = `sha256=${createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex')}`;

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(signature);

    if (expectedBuffer.length !== receivedBuffer.length) {
      throw new UnauthorizedException('Invalid GitHub webhook signature');
    }

    const valid = timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!valid) {
      throw new UnauthorizedException('Invalid GitHub webhook signature');
    }
  }

  /* ------------------------------------------------------------------------ */
  /*                              EVENT ROUTER                                */
  /* ------------------------------------------------------------------------ */

  async handleEvent(event: string, deliveryId: string, payload: unknown) {
    this.logger.log(
      `GitHub webhook received event=${event} delivery=${deliveryId}`,
    );

    switch (event) {
      case 'installation_repositories':
        return this.handleInstallationRepositories(
          deliveryId,
          payload as GithubInstallationRepositoriesPayload,
        );

      case 'installation':
        return this.handleInstallation(
          deliveryId,
          payload as GithubInstallationPayload,
        );

      case 'push':
        return this.handlePush(deliveryId, payload as GithubPushPayload);

      case 'pull_request':
        return this.handlePullRequest(
          deliveryId,
          payload as GithubPullRequestPayload,
        );

      case 'pull_request_review':
        return this.handlePullRequestReview(
          deliveryId,
          payload as GithubPullRequestReviewPayload,
        );

      case 'pull_request_review_comment':
        return this.handlePullRequestReviewComment(
          deliveryId,
          payload as GithubPullRequestReviewCommentPayload,
        );

      case 'issues':
        return this.handleIssue(deliveryId, payload as GithubIssuePayload);

      case 'issue_comment':
        return this.handleIssueComment(
          deliveryId,
          payload as GithubIssueCommentPayload,
        );

      default:
        this.logger.warn(`Unhandled GitHub event: ${event}`);

        return {
          received: true,
          ignored: true,
          event,
          deliveryId,
        };
    }
  }

  /* ------------------------------------------------------------------------ */
  /*                         INSTALLATION REPOSITORIES                        */
  /* ------------------------------------------------------------------------ */

  private async handleInstallationRepositories(
    deliveryId: string,
    payload: GithubInstallationRepositoriesPayload,
  ) {
    const installationId = payload.installation?.id;

    if (!installationId) {
      throw new BadRequestException('GitHub installation ID missing');
    }

    this.logger.log(
      `installation_repositories action=${payload.action} installation=${installationId}`,
    );

    this.logger.log(
      `Repositories added=${payload.repositories_added?.length ?? 0}, removed=${payload.repositories_removed?.length ?? 0}`,
    );

    const result =
      await this.githubService.syncInstallationFromWebhook(installationId);

    return {
      received: true,
      event: 'installation_repositories',
      deliveryId,
      action: payload.action,
      installationId,
      ...result,
    };
  }

  /* ------------------------------------------------------------------------ */
  /*                              INSTALLATION                                */
  /* ------------------------------------------------------------------------ */

  private async handleInstallation(
    deliveryId: string,
    payload: GithubInstallationPayload,
  ) {
    const installationId = payload.installation?.id;

    if (!installationId) {
      throw new BadRequestException('GitHub installation ID missing');
    }

    const action = payload.action;

    this.logger.log(
      `GitHub installation action=${action} installation=${installationId}`,
    );

    switch (action) {
      case 'created': {
        const result =
          await this.githubService.syncInstallationFromWebhook(installationId);

        return {
          received: true,
          event: 'installation',
          deliveryId,
          action,
          installationId,
          ...result,
        };
      }

      case 'suspend': {
        const result =
          await this.githubService.suspendInstallationFromWebhook(
            installationId,
          );

        if (result.suspended && result.organizationId) {
          this.realtimeGateway.emitToOrganization(
            result.organizationId,
            'github:installation_suspended',
            {
              installationId,
              organizationId: result.organizationId,
              action,
              occurredAt: new Date().toISOString(),
            },
          );
        }

        return {
          received: true,
          event: 'installation',
          deliveryId,
          action,
          installationId,
          ...result,
        };
      }

      case 'unsuspend': {
        const result =
          await this.githubService.unsuspendInstallationFromWebhook(
            installationId,
          );

        if (result.unsuspended && result.organizationId) {
          this.realtimeGateway.emitToOrganization(
            result.organizationId,
            'github:installation_unsuspended',
            {
              installationId,
              organizationId: result.organizationId,
              action,
              repositoryCount: result.repositoryCount,
              occurredAt: new Date().toISOString(),
            },
          );
        }

        return {
          received: true,
          event: 'installation',
          deliveryId,
          action,
          ...result,
        };
      }

      case 'deleted': {
        const result =
          await this.githubService.disconnectInstallationFromWebhook(
            installationId,
          );

        if (result.disconnected && result.organizationId) {
          this.realtimeGateway.emitToOrganization(
            result.organizationId,
            'github:installation_disconnected',
            {
              installationId,
              organizationId: result.organizationId,
              action,
              occurredAt: new Date().toISOString(),
            },
          );
        }

        return {
          received: true,
          event: 'installation',
          deliveryId,
          action,
          installationId,
          ...result,
        };
      }

      case 'new_permissions_accepted': {
        const result =
          await this.githubService.syncInstallationFromWebhook(installationId);

        if (result.synced && result.organizationId) {
          this.realtimeGateway.emitToOrganization(
            result.organizationId,
            'github:installation_updated',
            {
              installationId,
              organizationId: result.organizationId,
              action,
              repositoryCount: result.repositoryCount ?? 0,
              occurredAt: new Date().toISOString(),
            },
          );
        }

        return {
          received: true,
          event: 'installation',
          deliveryId,
          action,
          installationId,
          ...result,
        };
      }

      default:
        this.logger.log(
          `GitHub installation action=${action} acknowledged without additional processing`,
        );

        return {
          received: true,
          event: 'installation',
          deliveryId,
          action,
          installationId,
        };
    }
  }

  /* ------------------------------------------------------------------------ */
  /*                                  PUSH                                    */
  /* ------------------------------------------------------------------------ */

  private async handlePush(deliveryId: string, payload: GithubPushPayload) {
    const githubRepositoryId = payload.repository?.id;

    if (!githubRepositoryId) {
      throw new BadRequestException('GitHub repository ID missing');
    }

    const branch = payload.ref?.replace('refs/heads/', '') ?? null;

    const repository =
      await this.githubService.findActiveRepositoryByGithubId(
        githubRepositoryId,
      );

    if (!repository) {
      this.logger.warn(
        `Push ignored: GitHub repository ${githubRepositoryId} is not connected to DevFlow`,
      );

      return {
        received: true,
        event: 'push',
        deliveryId,
        ignored: true,
        reason: 'repository_not_connected',
      };
    }

    this.logger.log(
      `GitHub push repo=${payload.repository.full_name} branch=${branch} commits=${payload.commits?.length ?? 0}`,
    );

    let activity = null;

    if (repository.projectId) {
      activity = await this.activityLogsService.create({
        organizationId: repository.organizationId,

        projectId: repository.projectId,

        actorId: null,

        action: 'GITHUB_PUSH',

        entityType: 'GITHUB_REPOSITORY',

        entityId: repository.id,

        metadata: {
          deliveryId,

          githubRepositoryId,

          repositoryName: payload.repository.name,

          repositoryFullName: payload.repository.full_name,

          branch,

          ref: payload.ref,

          before: payload.before,

          after: payload.after,

          sender: payload.sender?.login ?? null,

          commitCount: payload.commits?.length ?? 0,

          commits:
            payload.commits?.map((commit) => ({
              id: commit.id,
              message: commit.message,
              timestamp: commit.timestamp,
              url: commit.url,
              author: commit.author?.name ?? null,
            })) ?? [],
        },
      });
    }

    if (repository.projectId && activity) {
      this.realtimeGateway.emitToProject(
        repository.organizationId,
        repository.projectId,
        'github:push',
        {
          activityId: activity.id,

          repository: {
            id: repository.id,

            githubRepositoryId,

            fullName: payload.repository.full_name,
          },

          branch,

          sender: payload.sender?.login ?? null,

          before: payload.before,

          after: payload.after,

          commitCount: payload.commits?.length ?? 0,

          commits:
            payload.commits?.map((commit) => ({
              id: commit.id,

              message: commit.message,

              timestamp: commit.timestamp,

              url: commit.url,

              author: commit.author?.name ?? null,
            })) ?? [],

          createdAt: activity.createdAt,
        },
      );

      this.logger.log(
        `Realtime github:push emitted project=${repository.projectId}`,
      );
    }

    return {
      received: true,
      event: 'push',
      deliveryId,

      repository: {
        id: repository.id,

        githubRepositoryId,

        fullName: payload.repository.full_name,

        projectId: repository.projectId,
      },

      branch,

      sender: payload.sender?.login ?? null,

      commitCount: payload.commits?.length ?? 0,

      activityCreated: Boolean(activity),

      activityId: activity?.id ?? null,
    };
  }

  /* ------------------------------------------------------------------------ */
  /*                             PULL REQUEST                                 */
  /* ------------------------------------------------------------------------ */

  private async handlePullRequest(
    deliveryId: string,
    payload: GithubPullRequestPayload,
  ) {
    const githubRepositoryId = payload.repository?.id;

    if (!githubRepositoryId) {
      throw new BadRequestException('GitHub repository ID missing');
    }

    if (!payload.pull_request) {
      throw new BadRequestException('GitHub pull request payload missing');
    }

    const repository =
      await this.githubService.findActiveRepositoryByGithubId(
        githubRepositoryId,
      );

    if (!repository) {
      this.logger.warn(
        `PR ignored: repository ${githubRepositoryId} is not connected`,
      );

      return {
        received: true,
        event: 'pull_request',
        deliveryId,
        ignored: true,
        reason: 'repository_not_connected',
      };
    }

    const pr = payload.pull_request;

    /*
     * Persist PR first.
     *
     * This creates/updates the canonical DevFlow PR row
     * before related files, commits, reviews and review
     * comments are persisted.
     */
    const persistedPullRequest =
      await this.githubEntityPersistenceService.upsertPullRequest({
        organizationId: repository.organizationId,
        repositoryId: repository.id,

        githubPullRequestId: pr.id,
        githubNumber: pr.number,

        title: pr.title,
        body: pr.body ?? null,
        state: pr.state,

        isDraft: pr.draft ?? false,

        authorLogin: pr.user?.login ?? null,

        headRef: pr.head?.ref ?? null,
        baseRef: pr.base?.ref ?? null,

        htmlUrl: pr.html_url,

        merged: pr.merged ?? false,

        // GitHub PR statistics
        additions: pr.additions ?? 0,
        deletions: pr.deletions ?? 0,
        changedFiles: pr.changed_files ?? 0,
        commitsCount: pr.commits ?? 0,
        commentsCount: pr.comments ?? 0,
        reviewCommentsCount: pr.review_comments ?? 0,

        githubCreatedAt: pr.created_at ?? null,
        githubUpdatedAt: pr.updated_at ?? null,
        githubClosedAt: pr.closed_at ?? null,
        githubMergedAt: pr.merged_at ?? null,
      });

    // =====================================================
    // PR ENRICHMENT SNAPSHOT
    // FILES + COMMITS + REVIEWS + REVIEW COMMENTS
    // =====================================================

    let pullRequestFilesSynced = false;
    let persistedFilesCount = 0;

    let pullRequestCommitsSynced = false;
    let persistedCommitsCount = 0;

    let pullRequestReviewsSynced = false;
    let persistedReviewsCount = 0;

    let pullRequestReviewCommentsSynced = false;
    let persistedReviewCommentsCount = 0;

    const githubInstallationId = payload.installation?.id;

    /*
     * Real GitHub App pull_request webhooks contain
     * installation.id.
     *
     * Synthetic/local webhook payloads may omit it.
     * In that case we keep processing the PR but skip
     * remote GitHub enrichment fetching.
     */
    if (githubInstallationId) {
      // -------------------------------------------------
      // Sync PR files / patches
      // -------------------------------------------------

      const pullRequestFiles = await this.githubService.getPullRequestFiles(
        githubInstallationId,
        repository.ownerLogin,
        repository.name,
        pr.number,
      );

      const persistedFiles =
        await this.githubEntityPersistenceService.replacePullRequestFiles(
          persistedPullRequest.id,
          pullRequestFiles,
        );

      persistedFilesCount = persistedFiles.length;
      pullRequestFilesSynced = true;

      this.logger.log(
        `GitHub PR files synced repo=${payload.repository.full_name} PR=#${pr.number} files=${persistedFilesCount}`,
      );

      // -------------------------------------------------
      // Sync PR commits
      // -------------------------------------------------

      const pullRequestCommits = await this.githubService.getPullRequestCommits(
        githubInstallationId,
        repository.ownerLogin,
        repository.name,
        pr.number,
      );

      const persistedCommits =
        await this.githubEntityPersistenceService.replacePullRequestCommits(
          persistedPullRequest.id,
          pullRequestCommits,
        );

      persistedCommitsCount = persistedCommits.length;
      pullRequestCommitsSynced = true;

      this.logger.log(
        `GitHub PR commits synced repo=${payload.repository.full_name} PR=#${pr.number} commits=${persistedCommitsCount}`,
      );

      // -------------------------------------------------
      // Sync PR reviews
      // -------------------------------------------------

      const pullRequestReviews = await this.githubService.getPullRequestReviews(
        githubInstallationId,
        repository.ownerLogin,
        repository.name,
        pr.number,
      );

      const persistedReviews =
        await this.githubEntityPersistenceService.replacePullRequestReviews(
          persistedPullRequest.id,
          pullRequestReviews,
        );

      persistedReviewsCount = persistedReviews.length;
      pullRequestReviewsSynced = true;

      this.logger.log(
        `GitHub PR reviews synced repo=${payload.repository.full_name} PR=#${pr.number} reviews=${persistedReviewsCount}`,
      );

      // -------------------------------------------------
      // Sync PR review comments
      // -------------------------------------------------

      const pullRequestReviewComments =
        await this.githubService.getPullRequestReviewComments(
          githubInstallationId,
          repository.ownerLogin,
          repository.name,
          pr.number,
        );

      const persistedReviewComments =
        await this.githubEntityPersistenceService.replacePullRequestReviewComments(
          persistedPullRequest.id,
          pullRequestReviewComments,
        );

      persistedReviewCommentsCount = persistedReviewComments.length;

      pullRequestReviewCommentsSynced = true;

      this.logger.log(
        `GitHub PR review comments synced repo=${payload.repository.full_name} PR=#${pr.number} reviewComments=${persistedReviewCommentsCount}`,
      );
    } else {
      this.logger.warn(
        `GitHub PR files, commits, reviews and review comments not synced repo=${payload.repository.full_name} PR=#${pr.number}: installation ID missing`,
      );
    }

    /*
     * Run automation only after the complete PR enrichment
     * snapshot has been persisted.
     */
    await this.githubTaskAutomationService.handlePullRequestChange(
      persistedPullRequest.id,
      payload.action,
    );

    const actionMap: Record<string, string> = {
      opened: 'GITHUB_PR_OPENED',

      closed: pr.merged ? 'GITHUB_PR_MERGED' : 'GITHUB_PR_CLOSED',

      reopened: 'GITHUB_PR_REOPENED',

      synchronize: 'GITHUB_PR_UPDATED',

      edited: 'GITHUB_PR_EDITED',

      ready_for_review: 'GITHUB_PR_READY_FOR_REVIEW',

      converted_to_draft: 'GITHUB_PR_DRAFTED',
    };

    const activityAction = actionMap[payload.action] ?? 'GITHUB_PR_EVENT';

    let activity = null;

    // =====================================================
    // ACTIVITY LOG
    // =====================================================

    if (repository.projectId) {
      activity = await this.activityLogsService.create({
        organizationId: repository.organizationId,

        projectId: repository.projectId,

        actorId: null,

        action: activityAction,

        entityType: 'GITHUB_PULL_REQUEST',

        entityId: persistedPullRequest.id,

        metadata: {
          deliveryId,

          githubRepositoryId,

          repositoryId: repository.id,

          repositoryFullName: payload.repository.full_name,

          action: payload.action,

          pullRequest: {
            id: persistedPullRequest.id,

            githubId: pr.id,

            number: pr.number,

            title: pr.title,

            body: pr.body ?? null,

            state: pr.state,

            draft: pr.draft ?? false,

            merged: pr.merged ?? false,

            mergedAt: pr.merged_at ?? null,

            url: pr.html_url,

            author: pr.user?.login ?? null,

            headBranch: pr.head?.ref ?? null,

            headSha: pr.head?.sha ?? null,

            baseBranch: pr.base?.ref ?? null,

            baseSha: pr.base?.sha ?? null,

            additions: pr.additions ?? 0,

            deletions: pr.deletions ?? 0,

            changedFiles: pr.changed_files ?? 0,

            commits: pr.commits ?? 0,

            comments: pr.comments ?? 0,

            reviewComments: pr.review_comments ?? 0,

            filesSynced: pullRequestFilesSynced,

            persistedFiles: persistedFilesCount,

            commitsSynced: pullRequestCommitsSynced,

            persistedCommits: persistedCommitsCount,

            reviewsSynced: pullRequestReviewsSynced,

            persistedReviews: persistedReviewsCount,

            reviewCommentsSynced: pullRequestReviewCommentsSynced,

            persistedReviewComments: persistedReviewCommentsCount,
          },

          sender: payload.sender?.login ?? null,
        },
      });
    }

    // =====================================================
    // REALTIME
    // =====================================================

    if (repository.projectId && activity) {
      this.realtimeGateway.emitToProject(
        repository.organizationId,
        repository.projectId,
        'github:pull_request',
        {
          activityId: activity.id,

          action: payload.action,

          repository: {
            id: repository.id,

            githubRepositoryId,

            fullName: payload.repository.full_name,
          },

          pullRequest: {
            id: persistedPullRequest.id,

            githubId: pr.id,

            number: pr.number,

            title: pr.title,

            state: pr.state,

            draft: pr.draft ?? false,

            merged: pr.merged ?? false,

            mergedAt: pr.merged_at ?? null,

            url: pr.html_url,

            author: pr.user?.login ?? null,

            headBranch: pr.head?.ref ?? null,

            headSha: pr.head?.sha ?? null,

            baseBranch: pr.base?.ref ?? null,

            baseSha: pr.base?.sha ?? null,

            additions: pr.additions ?? 0,

            deletions: pr.deletions ?? 0,

            changedFiles: pr.changed_files ?? 0,

            commits: pr.commits ?? 0,

            comments: pr.comments ?? 0,

            reviewComments: pr.review_comments ?? 0,

            filesSynced: pullRequestFilesSynced,

            persistedFiles: persistedFilesCount,

            commitsSynced: pullRequestCommitsSynced,

            persistedCommits: persistedCommitsCount,

            reviewsSynced: pullRequestReviewsSynced,

            persistedReviews: persistedReviewsCount,

            reviewCommentsSynced: pullRequestReviewCommentsSynced,

            persistedReviewComments: persistedReviewCommentsCount,
          },

          sender: payload.sender?.login ?? null,

          createdAt: activity.createdAt,
        },
      );

      this.logger.log(
        `Realtime github:pull_request emitted project=${repository.projectId} PR=#${pr.number} action=${payload.action}`,
      );
    }

    // =====================================================
    // FINAL LOG
    // =====================================================

    this.logger.log(
      `GitHub PR persisted repo=${payload.repository.full_name} PR=#${pr.number} action=${payload.action} additions=${pr.additions ?? 0} deletions=${pr.deletions ?? 0} files=${pr.changed_files ?? 0} persistedFiles=${persistedFilesCount} commits=${pr.commits ?? 0} persistedCommits=${persistedCommitsCount} persistedReviews=${persistedReviewsCount} persistedReviewComments=${persistedReviewCommentsCount}`,
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return {
      received: true,

      event: 'pull_request',

      deliveryId,

      action: payload.action,

      repository: {
        id: repository.id,

        githubRepositoryId,

        fullName: payload.repository.full_name,

        projectId: repository.projectId,
      },

      pullRequest: {
        id: persistedPullRequest.id,

        githubId: pr.id,

        number: pr.number,

        title: pr.title,

        state: pr.state,

        draft: pr.draft ?? false,

        merged: pr.merged ?? false,

        url: pr.html_url,

        stats: {
          additions: persistedPullRequest.additions,

          deletions: persistedPullRequest.deletions,

          changedFiles: persistedPullRequest.changedFiles,

          commits: persistedPullRequest.commitsCount,

          comments: persistedPullRequest.commentsCount,

          reviewComments: persistedPullRequest.reviewCommentsCount,
        },

        files: {
          synced: pullRequestFilesSynced,

          count: persistedFilesCount,
        },

        commits: {
          synced: pullRequestCommitsSynced,

          count: persistedCommitsCount,
        },

        reviews: {
          synced: pullRequestReviewsSynced,

          count: persistedReviewsCount,
        },

        reviewComments: {
          synced: pullRequestReviewCommentsSynced,

          count: persistedReviewCommentsCount,
        },
      },

      activityCreated: Boolean(activity),

      activityId: activity?.id ?? null,
    };
  }

  /* ------------------------------------------------------------------------ */
  /*                         PULL REQUEST REVIEW                              */
  /* ------------------------------------------------------------------------ */

  private async handlePullRequestReview(
    deliveryId: string,
    payload: GithubPullRequestReviewPayload,
  ) {
    const githubRepositoryId = payload.repository?.id;

    if (!githubRepositoryId) {
      throw new BadRequestException('GitHub repository ID missing');
    }

    if (!payload.pull_request) {
      throw new BadRequestException(
        'GitHub pull request missing from pull_request_review payload',
      );
    }

    if (!payload.review) {
      throw new BadRequestException(
        'GitHub review missing from pull_request_review payload',
      );
    }

    const githubInstallationId = payload.installation?.id;

    if (!githubInstallationId) {
      throw new BadRequestException(
        'GitHub installation ID missing from pull_request_review payload',
      );
    }

    const repository =
      await this.githubService.findActiveRepositoryByGithubId(
        githubRepositoryId,
      );

    if (!repository) {
      this.logger.warn(
        `PR review ignored: repository ${githubRepositoryId} is not connected`,
      );

      return {
        received: true,
        event: 'pull_request_review',
        deliveryId,
        ignored: true,
        reason: 'repository_not_connected',
      };
    }

    const pr = payload.pull_request;
    const review = payload.review;

    /*
     * The canonical PR should already exist because GitHub sends
     * pull_request events before review events.
     *
     * We resolve it using repository + GitHub PR number.
     */
    const persistedPullRequest =
      await this.githubEntityPersistenceService.findPullRequestByRepositoryAndNumber(
        repository.id,
        pr.number,
      );

    if (!persistedPullRequest) {
      this.logger.warn(
        `PR review ignored: canonical PR not found repo=${payload.repository.full_name} PR=#${pr.number}`,
      );

      return {
        received: true,
        event: 'pull_request_review',
        deliveryId,
        ignored: true,
        reason: 'pull_request_not_found',
      };
    }

    // =====================================================
    // REFRESH REVIEWS FROM GITHUB
    // =====================================================

    const pullRequestReviews = await this.githubService.getPullRequestReviews(
      githubInstallationId,
      repository.ownerLogin,
      repository.name,
      pr.number,
    );

    const persistedReviews =
      await this.githubEntityPersistenceService.replacePullRequestReviews(
        persistedPullRequest.id,
        pullRequestReviews,
      );

    /*
     * A submitted review may also contain code-line comments,
     * therefore refresh review comments as part of the same event.
     */
    const pullRequestReviewComments =
      await this.githubService.getPullRequestReviewComments(
        githubInstallationId,
        repository.ownerLogin,
        repository.name,
        pr.number,
      );

    const persistedReviewComments =
      await this.githubEntityPersistenceService.replacePullRequestReviewComments(
        persistedPullRequest.id,
        pullRequestReviewComments,
      );

    this.logger.log(
      `GitHub PR review synced repo=${payload.repository.full_name} PR=#${pr.number} reviews=${persistedReviews.length} reviewComments=${persistedReviewComments.length}`,
    );

    // =====================================================
    // ACTIVITY
    // =====================================================

    const actionMap: Record<string, string> = {
      submitted: 'GITHUB_PR_REVIEW_SUBMITTED',
      edited: 'GITHUB_PR_REVIEW_EDITED',
      dismissed: 'GITHUB_PR_REVIEW_DISMISSED',
    };

    const activityAction =
      actionMap[payload.action] ?? 'GITHUB_PR_REVIEW_EVENT';

    let activity = null;

    if (repository.projectId) {
      activity = await this.activityLogsService.create({
        organizationId: repository.organizationId,

        projectId: repository.projectId,

        actorId: null,

        action: activityAction,

        entityType: 'GITHUB_PULL_REQUEST',

        entityId: persistedPullRequest.id,

        metadata: {
          deliveryId,

          githubRepositoryId,

          repositoryId: repository.id,

          repositoryFullName: payload.repository.full_name,

          action: payload.action,

          pullRequest: {
            id: persistedPullRequest.id,
            githubId: pr.id,
            number: pr.number,
            title: pr.title,
            state: pr.state,
            url: pr.html_url,
          },

          review: {
            githubId: review.id,
            state: review.state,
            body: review.body ?? null,
            author: review.user?.login ?? null,
            commitSha: review.commit_id ?? null,
            url: review.html_url ?? null,
            submittedAt: review.submitted_at ?? null,
          },

          syncedReviews: persistedReviews.length,

          syncedReviewComments: persistedReviewComments.length,

          sender: payload.sender?.login ?? null,
        },
      });
    }

    // =====================================================
    // REALTIME
    // =====================================================

    if (repository.projectId && activity) {
      this.realtimeGateway.emitToProject(
        repository.organizationId,
        repository.projectId,
        'github:pull_request_review',
        {
          activityId: activity.id,

          action: payload.action,

          repository: {
            id: repository.id,
            githubRepositoryId,
            fullName: payload.repository.full_name,
          },

          pullRequest: {
            id: persistedPullRequest.id,
            githubId: pr.id,
            number: pr.number,
            title: pr.title,
            state: pr.state,
            url: pr.html_url,
          },

          review: {
            githubId: review.id,
            state: review.state,
            body: review.body ?? null,
            author: review.user?.login ?? null,
            commitSha: review.commit_id ?? null,
            url: review.html_url ?? null,
          },

          reviews: {
            synced: true,
            count: persistedReviews.length,
          },

          reviewComments: {
            synced: true,
            count: persistedReviewComments.length,
          },

          sender: payload.sender?.login ?? null,

          createdAt: activity.createdAt,
        },
      );

      this.logger.log(
        `Realtime github:pull_request_review emitted project=${repository.projectId} PR=#${pr.number} action=${payload.action}`,
      );
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return {
      received: true,

      event: 'pull_request_review',

      deliveryId,

      action: payload.action,

      repository: {
        id: repository.id,
        githubRepositoryId,
        fullName: payload.repository.full_name,
        projectId: repository.projectId,
      },

      pullRequest: {
        id: persistedPullRequest.id,
        githubId: pr.id,
        number: pr.number,
        title: pr.title,
      },

      review: {
        githubId: review.id,
        state: review.state,
        author: review.user?.login ?? null,
      },

      reviews: {
        synced: true,
        count: persistedReviews.length,
      },

      reviewComments: {
        synced: true,
        count: persistedReviewComments.length,
      },

      activityCreated: Boolean(activity),

      activityId: activity?.id ?? null,
    };
  }

  /* ------------------------------------------------------------------------ */
  /*                      PULL REQUEST REVIEW COMMENT                         */
  /* ------------------------------------------------------------------------ */

  private async handlePullRequestReviewComment(
    deliveryId: string,
    payload: GithubPullRequestReviewCommentPayload,
  ) {
    const githubRepositoryId = payload.repository?.id;

    if (!githubRepositoryId) {
      throw new BadRequestException('GitHub repository ID missing');
    }

    if (!payload.pull_request) {
      throw new BadRequestException(
        'GitHub pull request missing from pull_request_review_comment payload',
      );
    }

    if (!payload.comment) {
      throw new BadRequestException(
        'GitHub review comment missing from pull_request_review_comment payload',
      );
    }

    const githubInstallationId = payload.installation?.id;

    if (!githubInstallationId) {
      throw new BadRequestException(
        'GitHub installation ID missing from pull_request_review_comment payload',
      );
    }

    // =====================================================
    // FIND CONNECTED REPOSITORY
    // =====================================================

    const repository =
      await this.githubService.findActiveRepositoryByGithubId(
        githubRepositoryId,
      );

    if (!repository) {
      this.logger.warn(
        `PR review comment ignored: repository ${githubRepositoryId} is not connected`,
      );

      return {
        received: true,
        event: 'pull_request_review_comment',
        deliveryId,
        ignored: true,
        reason: 'repository_not_connected',
      };
    }

    const pr = payload.pull_request;
    const comment = payload.comment;

    // =====================================================
    // FIND CANONICAL DEVFLOW PR
    // =====================================================

    const persistedPullRequest =
      await this.githubEntityPersistenceService.findPullRequestByRepositoryAndNumber(
        repository.id,
        pr.number,
      );

    if (!persistedPullRequest) {
      this.logger.warn(
        `PR review comment ignored: canonical PR not found repo=${payload.repository.full_name} PR=#${pr.number}`,
      );

      return {
        received: true,
        event: 'pull_request_review_comment',
        deliveryId,
        ignored: true,
        reason: 'pull_request_not_found',
      };
    }

    // =====================================================
    // REFRESH REVIEW COMMENTS SNAPSHOT
    // =====================================================

    /*
     * Do not directly trust only the webhook comment.
     *
     * created / edited / deleted events should all result in
     * the local database matching GitHub's current snapshot.
     */
    const pullRequestReviewComments =
      await this.githubService.getPullRequestReviewComments(
        githubInstallationId,
        repository.ownerLogin,
        repository.name,
        pr.number,
      );

    const persistedReviewComments =
      await this.githubEntityPersistenceService.replacePullRequestReviewComments(
        persistedPullRequest.id,
        pullRequestReviewComments,
      );

    // =====================================================
    // REFRESH REVIEWS TOO
    // =====================================================

    /*
     * A review comment belongs to a review. Refreshing reviews
     * keeps both snapshots synchronized when GitHub creates or
     * changes review-related data.
     */
    const pullRequestReviews = await this.githubService.getPullRequestReviews(
      githubInstallationId,
      repository.ownerLogin,
      repository.name,
      pr.number,
    );

    const persistedReviews =
      await this.githubEntityPersistenceService.replacePullRequestReviews(
        persistedPullRequest.id,
        pullRequestReviews,
      );

    this.logger.log(
      `GitHub PR review comment synced repo=${payload.repository.full_name} PR=#${pr.number} action=${payload.action} reviewComments=${persistedReviewComments.length} reviews=${persistedReviews.length}`,
    );

    // =====================================================
    // ACTIVITY
    // =====================================================

    const actionMap: Record<string, string> = {
      created: 'GITHUB_PR_REVIEW_COMMENT_CREATED',
      edited: 'GITHUB_PR_REVIEW_COMMENT_EDITED',
      deleted: 'GITHUB_PR_REVIEW_COMMENT_DELETED',
    };

    const activityAction =
      actionMap[payload.action] ?? 'GITHUB_PR_REVIEW_COMMENT_EVENT';

    let activity = null;

    if (repository.projectId) {
      activity = await this.activityLogsService.create({
        organizationId: repository.organizationId,

        projectId: repository.projectId,

        actorId: null,

        action: activityAction,

        entityType: 'GITHUB_PULL_REQUEST',

        entityId: persistedPullRequest.id,

        metadata: {
          deliveryId,

          githubRepositoryId,

          repositoryId: repository.id,

          repositoryFullName: payload.repository.full_name,

          action: payload.action,

          pullRequest: {
            id: persistedPullRequest.id,

            githubId: pr.id,

            number: pr.number,

            title: pr.title,

            state: pr.state,

            url: pr.html_url,
          },

          comment: {
            githubId: comment.id,

            githubReviewId: comment.pull_request_review_id ?? null,

            author: comment.user?.login ?? null,

            body: comment.body ?? null,

            path: comment.path,

            line: comment.line ?? null,

            originalLine: comment.original_line ?? null,

            startLine: comment.start_line ?? null,

            originalStartLine: comment.original_start_line ?? null,

            side: comment.side ?? null,

            startSide: comment.start_side ?? null,

            commitSha: comment.commit_id ?? null,

            originalCommitSha: comment.original_commit_id ?? null,

            diffHunk: comment.diff_hunk ?? null,

            url: comment.html_url ?? null,

            createdAt: comment.created_at ?? null,

            updatedAt: comment.updated_at ?? null,
          },

          syncedReviews: persistedReviews.length,

          syncedReviewComments: persistedReviewComments.length,

          sender: payload.sender?.login ?? null,
        },
      });
    }

    // =====================================================
    // REALTIME
    // =====================================================

    if (repository.projectId && activity) {
      this.realtimeGateway.emitToProject(
        repository.organizationId,
        repository.projectId,
        'github:pull_request_review_comment',
        {
          activityId: activity.id,

          action: payload.action,

          repository: {
            id: repository.id,

            githubRepositoryId,

            fullName: payload.repository.full_name,
          },

          pullRequest: {
            id: persistedPullRequest.id,

            githubId: pr.id,

            number: pr.number,

            title: pr.title,

            state: pr.state,

            url: pr.html_url,
          },

          comment: {
            githubId: comment.id,

            githubReviewId: comment.pull_request_review_id ?? null,

            author: comment.user?.login ?? null,

            body: comment.body ?? null,

            path: comment.path,

            line: comment.line ?? null,

            originalLine: comment.original_line ?? null,

            side: comment.side ?? null,

            commitSha: comment.commit_id ?? null,

            url: comment.html_url ?? null,
          },

          reviews: {
            synced: true,
            count: persistedReviews.length,
          },

          reviewComments: {
            synced: true,
            count: persistedReviewComments.length,
          },

          sender: payload.sender?.login ?? null,

          createdAt: activity.createdAt,
        },
      );

      this.logger.log(
        `Realtime github:pull_request_review_comment emitted project=${repository.projectId} PR=#${pr.number} action=${payload.action}`,
      );
    }

    // =====================================================
    // FINAL LOG
    // =====================================================

    this.logger.log(
      `GitHub PR review comment processed repo=${payload.repository.full_name} PR=#${pr.number} action=${payload.action} comment=${comment.id} reviewComments=${persistedReviewComments.length}`,
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return {
      received: true,

      event: 'pull_request_review_comment',

      deliveryId,

      action: payload.action,

      repository: {
        id: repository.id,

        githubRepositoryId,

        fullName: payload.repository.full_name,

        projectId: repository.projectId,
      },

      pullRequest: {
        id: persistedPullRequest.id,

        githubId: pr.id,

        number: pr.number,

        title: pr.title,
      },

      comment: {
        githubId: comment.id,

        githubReviewId: comment.pull_request_review_id ?? null,

        author: comment.user?.login ?? null,

        path: comment.path,

        line: comment.line ?? null,

        side: comment.side ?? null,

        url: comment.html_url ?? null,
      },

      reviews: {
        synced: true,

        count: persistedReviews.length,
      },

      reviewComments: {
        synced: true,

        count: persistedReviewComments.length,
      },

      activityCreated: Boolean(activity),

      activityId: activity?.id ?? null,
    };
  }

  /* ------------------------------------------------------------------------ */
  /*                                  ISSUE                                   */
  /* ------------------------------------------------------------------------ */

  private async handleIssue(deliveryId: string, payload: GithubIssuePayload) {
    const githubRepositoryId = payload.repository?.id;

    if (!githubRepositoryId) {
      throw new BadRequestException('GitHub repository ID missing');
    }

    if (!payload.issue) {
      throw new BadRequestException('GitHub issue payload missing');
    }

    const repository =
      await this.githubService.findActiveRepositoryByGithubId(
        githubRepositoryId,
      );

    if (!repository) {
      this.logger.warn(
        `Issue ignored: repository ${githubRepositoryId} is not connected`,
      );

      return {
        received: true,
        event: 'issues',
        deliveryId,
        ignored: true,
        reason: 'repository_not_connected',
      };
    }

    const issue = payload.issue;

    /*
     * Persist first.
     */
    const persistedIssue =
      await this.githubEntityPersistenceService.upsertIssue({
        organizationId: repository.organizationId,

        repositoryId: repository.id,

        githubIssueId: issue.id,

        githubNumber: issue.number,

        title: issue.title,

        body: issue.body ?? null,

        state: issue.state,

        authorLogin: issue.user?.login ?? null,

        assigneeLogin: issue.assignee?.login ?? null,

        htmlUrl: issue.html_url,

        githubCreatedAt: issue.created_at ?? null,

        githubUpdatedAt: issue.updated_at ?? null,

        githubClosedAt: issue.closed_at ?? null,
      });

    await this.githubTaskAutomationService.handleIssueChange(
      persistedIssue.id,
      payload.action,
    );
    const actionMap: Record<string, string> = {
      opened: 'GITHUB_ISSUE_OPENED',

      closed: 'GITHUB_ISSUE_CLOSED',

      reopened: 'GITHUB_ISSUE_REOPENED',

      edited: 'GITHUB_ISSUE_EDITED',

      deleted: 'GITHUB_ISSUE_DELETED',

      assigned: 'GITHUB_ISSUE_ASSIGNED',

      unassigned: 'GITHUB_ISSUE_UNASSIGNED',

      labeled: 'GITHUB_ISSUE_LABELED',

      unlabeled: 'GITHUB_ISSUE_UNLABELED',

      pinned: 'GITHUB_ISSUE_PINNED',

      unpinned: 'GITHUB_ISSUE_UNPINNED',

      transferred: 'GITHUB_ISSUE_TRANSFERRED',
    };

    const activityAction = actionMap[payload.action] ?? 'GITHUB_ISSUE_EVENT';

    let activity = null;

    if (repository.projectId) {
      activity = await this.activityLogsService.create({
        organizationId: repository.organizationId,

        projectId: repository.projectId,

        actorId: null,

        action: activityAction,

        entityType: 'GITHUB_ISSUE',

        entityId: persistedIssue.id,

        metadata: {
          deliveryId,

          githubRepositoryId,

          repositoryId: repository.id,

          repositoryFullName: payload.repository.full_name,

          action: payload.action,

          issue: {
            id: persistedIssue.id,

            githubId: issue.id,

            number: issue.number,

            title: issue.title,

            body: issue.body ?? null,

            state: issue.state,

            stateReason: issue.state_reason ?? null,

            url: issue.html_url,

            author: issue.user?.login ?? null,

            assignee: issue.assignee?.login ?? null,

            assignees: issue.assignees?.map((assignee) => assignee.login) ?? [],

            labels:
              issue.labels?.map((label) => ({
                id: label.id ?? null,

                name: label.name ?? null,

                color: label.color ?? null,
              })) ?? [],

            createdAt: issue.created_at ?? null,

            updatedAt: issue.updated_at ?? null,

            closedAt: issue.closed_at ?? null,
          },

          sender: payload.sender?.login ?? null,
        },
      });
    }

    if (repository.projectId && activity) {
      this.realtimeGateway.emitToProject(
        repository.organizationId,
        repository.projectId,
        'github:issue',
        {
          activityId: activity.id,

          action: payload.action,

          repository: {
            id: repository.id,

            githubRepositoryId,

            fullName: payload.repository.full_name,
          },

          issue: {
            /*
             * DevFlow database UUID.
             */
            id: persistedIssue.id,

            githubId: issue.id,

            number: issue.number,

            title: issue.title,

            state: issue.state,

            stateReason: issue.state_reason ?? null,

            url: issue.html_url,

            author: issue.user?.login ?? null,

            assignee: issue.assignee?.login ?? null,

            labels:
              issue.labels?.map((label) => ({
                name: label.name ?? null,

                color: label.color ?? null,
              })) ?? [],
          },

          sender: payload.sender?.login ?? null,

          createdAt: activity.createdAt,
        },
      );

      this.logger.log(
        `Realtime github:issue emitted project=${repository.projectId} issue=#${issue.number} action=${payload.action}`,
      );
    }

    this.logger.log(
      `GitHub issue persisted repo=${payload.repository.full_name} issue=#${issue.number} action=${payload.action}`,
    );

    return {
      received: true,

      event: 'issues',

      deliveryId,

      action: payload.action,

      repository: {
        id: repository.id,

        githubRepositoryId,

        fullName: payload.repository.full_name,

        projectId: repository.projectId,
      },

      issue: {
        /*
         * DevFlow database UUID.
         */
        id: persistedIssue.id,

        githubId: issue.id,

        number: issue.number,

        title: issue.title,

        state: issue.state,

        url: issue.html_url,
      },

      activityCreated: Boolean(activity),

      activityId: activity?.id ?? null,
    };
  }

  /* ------------------------------------------------------------------------ */
  /*                             ISSUE COMMENT                                */
  /* ------------------------------------------------------------------------ */

  private async handleIssueComment(
    deliveryId: string,
    payload: GithubIssueCommentPayload,
  ) {
    const githubRepositoryId = payload.repository?.id;

    if (!githubRepositoryId) {
      throw new BadRequestException('GitHub repository ID missing');
    }

    if (!payload.issue) {
      throw new BadRequestException(
        'GitHub issue missing from issue_comment payload',
      );
    }

    if (!payload.comment) {
      throw new BadRequestException(
        'GitHub comment missing from issue_comment payload',
      );
    }

    const repository =
      await this.githubService.findActiveRepositoryByGithubId(
        githubRepositoryId,
      );

    if (!repository) {
      this.logger.warn(
        `Issue comment ignored: repository ${githubRepositoryId} is not connected`,
      );

      return {
        received: true,
        event: 'issue_comment',
        deliveryId,
        ignored: true,
        reason: 'repository_not_connected',
      };
    }

    const issue = payload.issue;

    const comment = payload.comment;

    const actionMap: Record<string, string> = {
      created: 'GITHUB_ISSUE_COMMENT_CREATED',

      edited: 'GITHUB_ISSUE_COMMENT_EDITED',

      deleted: 'GITHUB_ISSUE_COMMENT_DELETED',
    };

    const activityAction =
      actionMap[payload.action] ?? 'GITHUB_ISSUE_COMMENT_EVENT';

    const isPullRequest = Boolean(issue.pull_request);

    let activity = null;

    if (repository.projectId) {
      activity = await this.activityLogsService.create({
        organizationId: repository.organizationId,

        projectId: repository.projectId,

        actorId: null,

        action: activityAction,

        entityType: 'GITHUB_REPOSITORY',

        entityId: repository.id,

        metadata: {
          deliveryId,

          githubRepositoryId,

          repositoryFullName: payload.repository.full_name,

          action: payload.action,

          issue: {
            githubId: issue.id,

            number: issue.number,

            title: issue.title,

            state: issue.state,

            url: issue.html_url,

            isPullRequest,
          },

          comment: {
            githubId: comment.id,

            body: comment.body ?? null,

            url: comment.html_url,

            author: comment.user?.login ?? null,

            createdAt: comment.created_at ?? null,

            updatedAt: comment.updated_at ?? null,
          },

          sender: payload.sender?.login ?? null,
        },
      });
    }

    if (repository.projectId && activity) {
      this.realtimeGateway.emitToProject(
        repository.organizationId,
        repository.projectId,
        'github:issue_comment',
        {
          activityId: activity.id,

          action: payload.action,

          repository: {
            id: repository.id,

            githubRepositoryId,

            fullName: payload.repository.full_name,
          },

          issue: {
            number: issue.number,

            title: issue.title,

            state: issue.state,

            url: issue.html_url,

            isPullRequest,
          },

          comment: {
            githubId: comment.id,

            body: comment.body ?? null,

            url: comment.html_url,

            author: comment.user?.login ?? null,
          },

          sender: payload.sender?.login ?? null,

          createdAt: activity.createdAt,
        },
      );

      this.logger.log(
        `Realtime github:issue_comment emitted project=${repository.projectId} issue=#${issue.number} action=${payload.action}`,
      );
    }

    this.logger.log(
      `GitHub issue_comment repo=${payload.repository.full_name} issue=#${issue.number} action=${payload.action}`,
    );

    return {
      received: true,

      event: 'issue_comment',

      deliveryId,

      action: payload.action,

      repository: {
        id: repository.id,

        githubRepositoryId,

        fullName: payload.repository.full_name,

        projectId: repository.projectId,
      },

      issue: {
        number: issue.number,

        title: issue.title,

        isPullRequest,
      },

      comment: {
        id: comment.id,

        author: comment.user?.login ?? null,

        url: comment.html_url,
      },

      activityCreated: Boolean(activity),

      activityId: activity?.id ?? null,
    };
  }

  /* ------------------------------------------------------------------------ */
  /*                         DEVELOPMENT TEST HELPER                          */
  /* ------------------------------------------------------------------------ */

  generateTestSignature(payload: string) {
    return `sha256=${createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex')}`;
  }
}
