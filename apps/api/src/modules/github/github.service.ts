import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { App } from '@octokit/app';

import type { InstallationAccessTokenAuthentication } from '@octokit/auth-app';

import {
  githubInstallations,
  githubRepositories,
  organizationMembers,
  projects,
  users,
} from '@devflow/db';

import { and, eq, notInArray } from 'drizzle-orm';

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { DatabaseService } from '../../database/database.service.js';

type GithubRepositorySyncItem = {
  id: number;

  name: string;

  fullName: string;

  ownerLogin: string;

  isPrivate: boolean;

  isArchived: boolean;

  defaultBranch: string | null;

  htmlUrl: string;
};

type GithubInstallationAccount = {
  id: number;

  login: string;

  type: string;
};

@Injectable()
export class GithubService implements OnModuleInit {
  private readonly logger = new Logger(GithubService.name);

  private githubApp!: App;

  constructor(
    private readonly configService: ConfigService,

    private readonly databaseService: DatabaseService,
  ) {}

  // =====================================================
  // INITIALIZATION
  // =====================================================

  async onModuleInit(): Promise<void> {
    const appId = this.configService.get<string>('GITHUB_APP_ID');

    const privateKeyPath = this.configService.get<string>(
      'GITHUB_PRIVATE_KEY_PATH',
    );

    const webhookSecret = this.configService.get<string>(
      'GITHUB_WEBHOOK_SECRET',
    );

    if (!appId) {
      throw new Error('GITHUB_APP_ID is not configured');
    }

    if (!privateKeyPath) {
      throw new Error('GITHUB_PRIVATE_KEY_PATH is not configured');
    }

    if (!webhookSecret) {
      throw new Error('GITHUB_WEBHOOK_SECRET is not configured');
    }

    const absolutePrivateKeyPath = resolve(process.cwd(), privateKeyPath);

    let privateKey: string;

    try {
      privateKey = await readFile(absolutePrivateKeyPath, 'utf8');
    } catch (error) {
      this.logger.error(
        `Unable to read GitHub private key from ${absolutePrivateKeyPath}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new Error('Unable to read GitHub App private key');
    }

    this.githubApp = new App({
      appId,

      privateKey,

      webhooks: {
        secret: webhookSecret,
      },
    });

    this.logger.log('GitHub App client initialized successfully');
  }

  // =====================================================
  // APP AUTHENTICATION
  // =====================================================

  async getAppInfo() {
    try {
      const response = await this.githubApp.octokit.request('GET /app');

      return response.data;
    } catch (error) {
      this.logGithubError('Failed to authenticate GitHub App', error);

      throw new InternalServerErrorException(
        'Failed to authenticate GitHub App',
      );
    }
  }

  // =====================================================
  // INSTALLATION TOKEN
  // =====================================================

  async getInstallationToken(
    installationId: number,
  ): Promise<InstallationAccessTokenAuthentication> {
    this.validateInstallationId(installationId);

    try {
      const installationOctokit =
        await this.githubApp.getInstallationOctokit(installationId);

      const auth = await installationOctokit.auth({
        type: 'installation',
      });

      return auth as InstallationAccessTokenAuthentication;
    } catch (error) {
      this.logGithubError(
        `Failed to authenticate GitHub installation ${installationId}`,
        error,
      );

      throw new InternalServerErrorException(
        'Failed to authenticate GitHub installation',
      );
    }
  }

  // =====================================================
  // LIST APP INSTALLATIONS
  // =====================================================

  async listInstallations() {
    try {
      const installations = [];

      let page = 1;

      while (true) {
        const response = await this.githubApp.octokit.request(
          'GET /app/installations',
          {
            per_page: 100,
            page,
          },
        );

        const currentInstallations = response.data;

        installations.push(...currentInstallations);

        if (currentInstallations.length < 100) {
          break;
        }

        page += 1;
      }

      return installations;
    } catch (error) {
      this.logGithubError('Failed to list GitHub installations', error);

      throw new InternalServerErrorException(
        'Failed to fetch GitHub installations',
      );
    }
  }

  // =====================================================
  // GET SINGLE INSTALLATION
  // =====================================================

  async getInstallation(installationId: number) {
    this.validateInstallationId(installationId);

    try {
      const response = await this.githubApp.octokit.request(
        'GET /app/installations/{installation_id}',
        {
          installation_id: installationId,
        },
      );

      return response.data;
    } catch (error) {
      this.logGithubError(
        `Failed to fetch GitHub installation ${installationId}`,
        error,
      );

      throw new NotFoundException('GitHub installation not found');
    }
  }

  // =====================================================
  // GET INSTALLATION REPOSITORIES
  // =====================================================

  async listInstallationRepositories(
    installationId: number,
  ): Promise<GithubRepositorySyncItem[]> {
    this.validateInstallationId(installationId);

    try {
      const installationOctokit =
        await this.githubApp.getInstallationOctokit(installationId);

      const repositories: GithubRepositorySyncItem[] = [];

      let page = 1;

      while (true) {
        const response = await installationOctokit.request(
          'GET /installation/repositories',
          {
            per_page: 100,
            page,
          },
        );

        const currentRepositories = response.data.repositories;

        for (const repository of currentRepositories) {
          const repositoryId = this.normalizeGithubId(
            repository.id,
            'repository.id',
          );

          repositories.push({
            id: repositoryId,

            name: repository.name,

            fullName: repository.full_name,

            ownerLogin:
              repository.owner?.login ??
              repository.full_name.split('/')[0] ??
              'unknown',

            isPrivate: repository.private,

            isArchived: repository.archived ?? false,

            defaultBranch: repository.default_branch ?? null,

            htmlUrl: repository.html_url,
          });
        }

        if (currentRepositories.length < 100) {
          break;
        }

        page += 1;
      }

      return repositories;
    } catch (error) {
      this.logGithubError(
        `Failed to fetch repositories for GitHub installation ${installationId}`,
        error,
      );

      throw new InternalServerErrorException(
        'Failed to fetch GitHub repositories',
      );
    }
  }

  // =====================================================
  // SYNC INSTALLATION
  // =====================================================

  async syncInstallation(
    organizationId: string,
    clerkUserId: string,
    githubInstallationId: number,
  ) {
    this.validateInstallationId(githubInstallationId);

    if (!organizationId) {
      throw new BadRequestException('Organization ID is required');
    }

    if (!clerkUserId) {
      throw new BadRequestException('Authenticated user is required');
    }

    const db = this.databaseService.db;

    // -------------------------------------------------
    // Resolve current DevFlow user
    // -------------------------------------------------

    const [currentUser] = await db
      .select({
        id: users.id,

        externalAuthId: users.externalAuthId,
      })
      .from(users)
      .where(eq(users.externalAuthId, clerkUserId))
      .limit(1);

    if (!currentUser) {
      throw new NotFoundException('Current DevFlow user not found');
    }

    // -------------------------------------------------
    // Check organization membership
    // -------------------------------------------------

    const [membership] = await db
      .select({
        role: organizationMembers.role,
      })
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),

          eq(organizationMembers.userId, currentUser.id),
        ),
      )
      .limit(1);

    if (!membership) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only organization owners and admins can connect GitHub',
      );
    }

    // -------------------------------------------------
    // Prevent an existing installation being stolen
    // by another DevFlow organization.
    // -------------------------------------------------

    const [existingInstallation] = await db
      .select({
        id: githubInstallations.id,

        organizationId: githubInstallations.organizationId,
      })
      .from(githubInstallations)
      .where(eq(githubInstallations.githubInstallationId, githubInstallationId))
      .limit(1);

    if (
      existingInstallation &&
      existingInstallation.organizationId !== organizationId
    ) {
      throw new ConflictException(
        'This GitHub installation is already connected to another DevFlow organization',
      );
    }

    // -------------------------------------------------
    // Fetch authoritative data from GitHub BEFORE
    // opening database transaction.
    // -------------------------------------------------

    const installation = await this.getInstallation(githubInstallationId);

    const repositories =
      await this.listInstallationRepositories(githubInstallationId);

    // -------------------------------------------------
    // Normalize GitHub installation ID
    // -------------------------------------------------

    const normalizedInstallationId = this.normalizeGithubId(
      installation.id,
      'installation.id',
    );

    // The requested installation and returned installation
    // should always be identical.
    if (normalizedInstallationId !== githubInstallationId) {
      throw new BadRequestException('GitHub installation ID mismatch');
    }

    // -------------------------------------------------
    // Normalize GitHub account
    // -------------------------------------------------

    const githubAccount = this.extractInstallationAccount(installation.account);

    const targetType = installation.target_type ?? githubAccount.type;

    // -------------------------------------------------
    // Perform DB sync atomically
    // -------------------------------------------------

    const syncResult = await db.transaction(async (tx) => {
      // -------------------------------------------
      // Upsert installation
      // -------------------------------------------

      const [savedInstallation] = await tx
        .insert(githubInstallations)
        .values({
          organizationId,

          connectedById: currentUser.id,

          githubInstallationId: normalizedInstallationId,

          githubAccountId: githubAccount.id,

          accountLogin: githubAccount.login,

          accountType: githubAccount.type,

          targetType,

          disconnectedAt: null,

          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: githubInstallations.githubInstallationId,

          set: {
            organizationId,

            connectedById: currentUser.id,

            githubAccountId: githubAccount.id,

            accountLogin: githubAccount.login,

            accountType: githubAccount.type,

            targetType,

            disconnectedAt: null,

            updatedAt: new Date(),
          },
        })
        .returning();

      if (!savedInstallation) {
        throw new InternalServerErrorException(
          'Failed to save GitHub installation',
        );
      }

      // -------------------------------------------
      // Upsert accessible repositories
      // -------------------------------------------

      for (const repository of repositories) {
        await tx
          .insert(githubRepositories)
          .values({
            organizationId,

            installationId: savedInstallation.id,

            githubRepositoryId: repository.id,

            ownerLogin: repository.ownerLogin,

            name: repository.name,

            fullName: repository.fullName,

            defaultBranch: repository.defaultBranch,

            htmlUrl: repository.htmlUrl,

            isPrivate: repository.isPrivate,

            isArchived: repository.isArchived,

            isActive: true,

            removedAt: null,

            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: githubRepositories.githubRepositoryId,

            set: {
              organizationId,

              installationId: savedInstallation.id,

              ownerLogin: repository.ownerLogin,

              name: repository.name,

              fullName: repository.fullName,

              defaultBranch: repository.defaultBranch,

              htmlUrl: repository.htmlUrl,

              isPrivate: repository.isPrivate,

              isArchived: repository.isArchived,

              isActive: true,

              removedAt: null,

              updatedAt: new Date(),
            },
          });
      }

      // -------------------------------------------
      // Repositories no longer available to the
      // installation are soft-disabled.
      // -------------------------------------------

      const activeGithubRepositoryIds = repositories.map(
        (repository) => repository.id,
      );

      if (activeGithubRepositoryIds.length > 0) {
        await tx
          .update(githubRepositories)
          .set({
            isActive: false,

            removedAt: new Date(),

            updatedAt: new Date(),
          })
          .where(
            and(
              eq(githubRepositories.installationId, savedInstallation.id),

              eq(githubRepositories.isActive, true),

              notInArray(
                githubRepositories.githubRepositoryId,
                activeGithubRepositoryIds,
              ),
            ),
          );
      } else {
        await tx
          .update(githubRepositories)
          .set({
            isActive: false,

            removedAt: new Date(),

            updatedAt: new Date(),
          })
          .where(
            and(
              eq(githubRepositories.installationId, savedInstallation.id),

              eq(githubRepositories.isActive, true),
            ),
          );
      }

      return {
        installation: savedInstallation,

        repositoryCount: repositories.length,
      };
    });

    this.logger.log(
      `GitHub installation ${normalizedInstallationId} synced with ${syncResult.repositoryCount} repositories for organization ${organizationId}`,
    );

    return {
      installation: syncResult.installation,

      repositories: {
        synced: syncResult.repositoryCount,
      },
    };
  }

  // =====================================================
  // HELPER: NORMALIZE GITHUB ID
  // =====================================================

  private normalizeGithubId(value: number | bigint, fieldName: string): number {
    const normalized = typeof value === 'bigint' ? Number(value) : value;

    if (!Number.isSafeInteger(normalized) || normalized <= 0) {
      throw new InternalServerErrorException(
        `Invalid GitHub identifier received for ${fieldName}`,
      );
    }

    return normalized;
  }

  // =====================================================
  // HELPER: EXTRACT INSTALLATION ACCOUNT
  // =====================================================

  private extractInstallationAccount(
    account: unknown,
  ): GithubInstallationAccount {
    if (!account || typeof account !== 'object') {
      throw new InternalServerErrorException(
        'GitHub installation account information is missing',
      );
    }

    const accountRecord = account as Record<string, unknown>;

    const rawId = accountRecord.id;

    const login = accountRecord.login;

    const type = accountRecord.type;

    if (typeof rawId !== 'number' && typeof rawId !== 'bigint') {
      throw new InternalServerErrorException('GitHub account ID is missing');
    }

    if (typeof login !== 'string' || login.trim().length === 0) {
      throw new InternalServerErrorException('GitHub account login is missing');
    }

    return {
      id: this.normalizeGithubId(rawId, 'installation.account.id'),

      login: login.trim(),

      type:
        typeof type === 'string' && type.trim().length > 0 ? type : 'Unknown',
    };
  }

  // =====================================================
  // HELPER: VALIDATE INSTALLATION ID
  // =====================================================

  private validateInstallationId(installationId: number): void {
    if (!Number.isSafeInteger(installationId) || installationId <= 0) {
      throw new BadRequestException('Invalid GitHub installation ID');
    }
  }

  // =====================================================
  // HELPER: LOG GITHUB ERRORS SAFELY
  // =====================================================

  private logGithubError(message: string, error: unknown): void {
    if (error instanceof Error) {
      this.logger.error(message, error.stack);

      return;
    }

    this.logger.error(message);
  }
  async getOrganizationRepositories(
    organizationId: string,
    clerkUserId: string,
  ) {
    const currentUser = await this.getCurrentUser(clerkUserId);

    await this.requireOrganizationMembership(organizationId, currentUser.id);

    return this.databaseService.db
      .select()
      .from(githubRepositories)
      .where(
        and(
          eq(githubRepositories.organizationId, organizationId),
          eq(githubRepositories.isActive, true),
        ),
      );
  }

  async linkRepositoryToProject(
    organizationId: string,
    repositoryId: string,
    projectId: string,
    clerkUserId: string,
  ) {
    const db = this.databaseService.db;

    const currentUser = await this.getCurrentUser(clerkUserId);

    const membership = await this.requireOrganizationMembership(
      organizationId,
      currentUser.id,
    );

    if (
      membership.role !== 'OWNER' &&
      membership.role !== 'ADMIN' &&
      membership.role !== 'PROJECT_MANAGER'
    ) {
      throw new ForbiddenException(
        'You do not have permission to link repositories',
      );
    }

    const [repository] = await db
      .select()
      .from(githubRepositories)
      .where(
        and(
          eq(githubRepositories.id, repositoryId),
          eq(githubRepositories.organizationId, organizationId),
          eq(githubRepositories.isActive, true),
        ),
      )
      .limit(1);

    if (!repository) {
      throw new NotFoundException('GitHub repository not found');
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const [updatedRepository] = await db
      .update(githubRepositories)
      .set({
        projectId,
        updatedAt: new Date(),
      })
      .where(eq(githubRepositories.id, repository.id))
      .returning();

    return updatedRepository;
  }

  async unlinkRepositoryFromProject(
    organizationId: string,
    repositoryId: string,
    clerkUserId: string,
  ) {
    const db = this.databaseService.db;

    const currentUser = await this.getCurrentUser(clerkUserId);

    const membership = await this.requireOrganizationMembership(
      organizationId,
      currentUser.id,
    );

    if (
      membership.role !== 'OWNER' &&
      membership.role !== 'ADMIN' &&
      membership.role !== 'PROJECT_MANAGER'
    ) {
      throw new ForbiddenException(
        'You do not have permission to unlink repositories',
      );
    }

    const [repository] = await db
      .select()
      .from(githubRepositories)
      .where(
        and(
          eq(githubRepositories.id, repositoryId),
          eq(githubRepositories.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (!repository) {
      throw new NotFoundException('GitHub repository not found');
    }

    const [updatedRepository] = await db
      .update(githubRepositories)
      .set({
        projectId: null,
        updatedAt: new Date(),
      })
      .where(eq(githubRepositories.id, repository.id))
      .returning();

    return updatedRepository;
  }
  private async getCurrentUser(clerkUserId: string) {
    const [user] = await this.databaseService.db
      .select({
        id: users.id,
        externalAuthId: users.externalAuthId,
      })
      .from(users)
      .where(eq(users.externalAuthId, clerkUserId))
      .limit(1);

    if (!user) {
      throw new NotFoundException('Current DevFlow user not found');
    }

    return user;
  }

  private async requireOrganizationMembership(
    organizationId: string,
    userId: string,
  ) {
    const [membership] = await this.databaseService.db
      .select({
        role: organizationMembers.role,
      })
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId),
        ),
      )
      .limit(1);

    if (!membership) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    return membership;
  }
  async syncInstallationFromWebhook(githubInstallationId: number) {
    this.logger.log(
      `Webhook repository sync started for installation ${githubInstallationId}`,
    );

    // 1. Find which DevFlow organization owns this GitHub installation
    const [installation] = await this.databaseService.db
      .select()
      .from(githubInstallations)
      .where(eq(githubInstallations.githubInstallationId, githubInstallationId))
      .limit(1);

    if (!installation) {
      this.logger.warn(
        `GitHub installation ${githubInstallationId} is not connected to any DevFlow organization`,
      );

      return {
        synced: false,
        reason: 'installation_not_connected',
      };
    }

    // 2. Fetch authoritative repository list from GitHub
    const repositories =
      await this.listInstallationRepositories(githubInstallationId);

    const githubRepositoryIds = repositories.map((repo) =>
      this.normalizeGithubId(repo.id, 'githubRepositoryId'),
    );

    // 3. Sync everything atomically
    await this.databaseService.db.transaction(async (tx) => {
      for (const repo of repositories) {
        const githubRepositoryId = this.normalizeGithubId(
          repo.id,
          'githubRepositoryId',
        );

        await tx
          .insert(githubRepositories)
          .values({
            organizationId: installation.organizationId,
            installationId: installation.id,

            githubRepositoryId,

            ownerLogin: repo.ownerLogin,
            name: repo.name,
            fullName: repo.fullName,
            defaultBranch: repo.defaultBranch ?? 'main',
            htmlUrl: repo.htmlUrl,

            isPrivate: repo.isPrivate,
            isArchived: repo.isArchived,
            isActive: true,

            removedAt: null,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: githubRepositories.githubRepositoryId,
            set: {
              organizationId: installation.organizationId,
              installationId: installation.id,

              ownerLogin: repo.ownerLogin,
              name: repo.name,
              fullName: repo.fullName,
              defaultBranch: repo.defaultBranch ?? 'main',
              htmlUrl: repo.htmlUrl,

              isPrivate: repo.isPrivate,
              isArchived: repo.isArchived,
              isActive: true,

              removedAt: null,
              updatedAt: new Date(),
            },
          });
      }

      // Mark repositories removed from installation as inactive
      const existingRepositories = await tx
        .select()
        .from(githubRepositories)
        .where(eq(githubRepositories.installationId, installation.id));

      for (const existingRepository of existingRepositories) {
        const stillExists = githubRepositoryIds.includes(
          existingRepository.githubRepositoryId,
        );

        if (!stillExists && existingRepository.isActive) {
          await tx
            .update(githubRepositories)
            .set({
              isActive: false,
              removedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(githubRepositories.id, existingRepository.id));
        }
      }

      await tx
        .update(githubInstallations)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(githubInstallations.id, installation.id));
    });

    this.logger.log(
      `Webhook repository sync completed for installation ${githubInstallationId}. Repositories=${repositories.length}`,
    );

    return {
      synced: true,
      organizationId: installation.organizationId,
      repositoryCount: repositories.length,
    };
  }
  async findActiveRepositoryByGithubId(githubRepositoryId: number) {
    const normalizedId = this.normalizeGithubId(
      githubRepositoryId,
      'githubRepositoryId',
    );

    const [repository] = await this.databaseService.db
      .select()
      .from(githubRepositories)
      .where(
        and(
          eq(githubRepositories.githubRepositoryId, normalizedId),
          eq(githubRepositories.isActive, true),
        ),
      )
      .limit(1);

    return repository ?? null;
  }

  async suspendInstallationFromWebhook(githubInstallationId: number) {
    this.validateInstallationId(githubInstallationId);

    const db = this.databaseService.db;

    const [installation] = await db
      .select()
      .from(githubInstallations)
      .where(eq(githubInstallations.githubInstallationId, githubInstallationId))
      .limit(1);

    if (!installation) {
      this.logger.warn(
        `GitHub installation ${githubInstallationId} cannot be suspended because it is not connected`,
      );

      return {
        suspended: false,
        reason: 'installation_not_connected',
      };
    }

    const now = new Date();

    await db.transaction(async (tx) => {
      await tx
        .update(githubInstallations)
        .set({
          disconnectedAt: now,
          updatedAt: now,
        })
        .where(eq(githubInstallations.id, installation.id));

      await tx
        .update(githubRepositories)
        .set({
          isActive: false,
          removedAt: now,
          updatedAt: now,
        })
        .where(eq(githubRepositories.installationId, installation.id));
    });

    this.logger.warn(
      `GitHub installation ${githubInstallationId} suspended for organization ${installation.organizationId}`,
    );

    return {
      suspended: true,
      installationId: githubInstallationId,
      organizationId: installation.organizationId,
    };
  }

  async disconnectInstallationFromWebhook(githubInstallationId: number) {
    this.validateInstallationId(githubInstallationId);

    const db = this.databaseService.db;

    const [installation] = await db
      .select()
      .from(githubInstallations)
      .where(eq(githubInstallations.githubInstallationId, githubInstallationId))
      .limit(1);

    if (!installation) {
      this.logger.warn(
        `GitHub installation ${githubInstallationId} cannot be disconnected because it is not connected`,
      );

      return {
        disconnected: false,
        reason: 'installation_not_connected',
      };
    }

    const now = new Date();

    await db.transaction(async (tx) => {
      await tx
        .update(githubInstallations)
        .set({
          disconnectedAt: now,
          updatedAt: now,
        })
        .where(eq(githubInstallations.id, installation.id));

      await tx
        .update(githubRepositories)
        .set({
          isActive: false,
          removedAt: now,
          updatedAt: now,
        })
        .where(eq(githubRepositories.installationId, installation.id));
    });

    this.logger.warn(
      `GitHub installation ${githubInstallationId} disconnected from organization ${installation.organizationId}`,
    );

    return {
      disconnected: true,
      installationId: githubInstallationId,
      organizationId: installation.organizationId,
    };
  }
  async unsuspendInstallationFromWebhook(githubInstallationId: number) {
    this.validateInstallationId(githubInstallationId);

    const db = this.databaseService.db;

    const [installation] = await db
      .select()
      .from(githubInstallations)
      .where(eq(githubInstallations.githubInstallationId, githubInstallationId))
      .limit(1);

    if (!installation) {
      this.logger.warn(
        `GitHub installation ${githubInstallationId} cannot be unsuspended because it is not connected`,
      );

      return {
        unsuspended: false,
        reason: 'installation_not_connected',
      };
    }

    await db
      .update(githubInstallations)
      .set({
        disconnectedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(githubInstallations.id, installation.id));

    /*
     * Fetch latest repository access from GitHub and reactivate
     * only repositories that are actually accessible.
     */
    const syncResult =
      await this.syncInstallationFromWebhook(githubInstallationId);

    this.logger.log(
      `GitHub installation ${githubInstallationId} unsuspended for organization ${installation.organizationId}`,
    );

    return {
      unsuspended: true,
      installationId: githubInstallationId,
      organizationId: installation.organizationId,
      ...syncResult,
    };
  }
}
