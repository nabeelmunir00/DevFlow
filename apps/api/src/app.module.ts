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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
