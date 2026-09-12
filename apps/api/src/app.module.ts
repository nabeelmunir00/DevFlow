import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { OrganizationsModule } from './modules/organizations/organizations.module.js';
import { OrganizationMembersModule } from './modules/organization-members/organization-members.module.js';
import { OrganizationInvitationsModule } from './modules/organization-invitations/organization-invitations.module.js';
import { EmailModule } from './modules/email/email.module.js';
import { TeamsModule } from './modules/teams/teams.module.js';
import { TeamMembersModule } from './modules/team-members/team-members.module.js';
import { TasksModule } from './modules/tasks/tasks.module.js';
import { ProjectsModule } from './modules/projects/projects.module.js';
import { SprintsModule } from './modules/sprints/sprints.module.js';
import { ActivityLogsModule } from './modules/activity-logs/activity-logs.module.js';
import { RedisModule } from './redis/redis.module.js';
import { QueueModule } from './queue/queue.module.js';
import { CommentsModule } from './modules/comments/comments.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { StorageModule } from './modules/storage/storage.module.js';
import { AttachmentsModule } from './modules/attachments/attachments.module.js';

import { SubtasksModule } from './modules/subtasks/subtasks.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    OrganizationMembersModule,
    OrganizationInvitationsModule,
    EmailModule,
    TeamsModule,
    TeamMembersModule,
    TasksModule,
    ProjectsModule,
    SprintsModule,
    ActivityLogsModule,
    RedisModule,
    QueueModule,
    CommentsModule,
    NotificationsModule,
    StorageModule,
    AttachmentsModule,

    SubtasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
