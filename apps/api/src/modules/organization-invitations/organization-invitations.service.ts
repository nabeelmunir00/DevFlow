import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  GoneException,
  InternalServerErrorException,
} from '@nestjs/common';

import { createHash, randomBytes } from 'node:crypto';
import { and, eq } from 'drizzle-orm';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';

import { CreateOrganizationInvitationDto } from './dto/create-organization-invitation.dto.js';
import { EmailQueueService } from '../../queue/email-queue.service.js';
import { EmailService } from '../email/email.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrganizationInvitationsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
    private readonly emailQueueService: EmailQueueService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    clerkUserId: string,
    organizationId: string,
    dto: CreateOrganizationInvitationDto,
  ) {
    // 1. Current logged-in DevFlow user
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    // 2. Check organization
    const organization =
      await this.databaseService.db.query.organizations.findFirst({
        where: (organizations, { eq }) => eq(organizations.id, organizationId),
      });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // 3. Check current user's membership
    const currentMembership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, currentUser.id),
          ),
      });

    if (!currentMembership) {
      throw new NotFoundException('Organization not found');
    }

    // 4. Only OWNER / ADMIN can invite
    if (
      currentMembership.role !== 'OWNER' &&
      currentMembership.role !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You do not have permission to invite members',
      );
    }

    // Optional stricter RBAC:
    // ADMIN cannot create another ADMIN
    if (currentMembership.role === 'ADMIN' && dto.role === 'ADMIN') {
      throw new ForbiddenException(
        'Only organization owner can invite an admin',
      );
    }

    // 5. Normalize email
    const email = dto.email.trim().toLowerCase();

    // 6. Check if target already exists as DevFlow user
    const targetUser = await this.usersService.findOptionalByEmail(email);

    // 7. If user exists, check if already member
    if (targetUser) {
      const existingMembership =
        await this.databaseService.db.query.organizationMembers.findFirst({
          where: (members, { and, eq }) =>
            and(
              eq(members.organizationId, organizationId),
              eq(members.userId, targetUser.id),
            ),
        });

      if (existingMembership) {
        throw new ConflictException(
          'User is already a member of this organization',
        );
      }
    }

    // 8. Check existing pending invite
    const existingInvitation =
      await this.databaseService.db.query.organizationInvitations.findFirst({
        where: (invitations, { and, eq }) =>
          and(
            eq(invitations.organizationId, organizationId),
            eq(invitations.email, email),
            eq(invitations.status, 'PENDING'),
          ),
      });

    if (existingInvitation) {
      // If old pending invitation has already expired,
      // mark it expired instead of blocking forever.
      if (existingInvitation.expiresAt.getTime() < Date.now()) {
        await this.databaseService.db
          .update(schema.organizationInvitations)
          .set({
            status: 'EXPIRED',
          })
          .where(eq(schema.organizationInvitations.id, existingInvitation.id));
      } else {
        throw new ConflictException(
          'A pending invitation already exists for this email',
        );
      }
    }

    // 9. Generate secure raw token
    const token = randomBytes(32).toString('hex');

    // 10. Store only token hash
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // 11. Invitation expiry: 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // 12. Create invitation in DB
    const [invitation] = await this.databaseService.db
      .insert(schema.organizationInvitations)
      .values({
        organizationId,
        email,
        role: dto.role,
        tokenHash,
        status: 'PENDING',
        invitedBy: currentUser.id,
        expiresAt,
      })
      .returning();

    if (!invitation) {
      throw new InternalServerErrorException('Failed to create invitation');
    }

    // 13. Build frontend invite URL
    const webUrl =
      this.configService.get<string>('WEB_URL') ?? 'http://localhost:3000';

    const inviteUrl = `${webUrl}/invitations/${token}`;

    // 14. Send invitation email
    try {
      await this.emailQueueService.addOrganizationInvitationEmail({
        to: invitation.email,
        organizationName: organization.name,
        inviterName: currentUser.name ?? currentUser.email,
        role: invitation.role,
        inviteUrl,
        expiresAt: invitation.expiresAt.toISOString(),
      });
    } catch (error) {
      /*
      For now we revoke the invitation if email sending fails.

      Later when we add BullMQ:
      DB invitation creation and email delivery will be
      handled more robustly through background jobs/retries.
    */

      await this.databaseService.db
        .update(schema.organizationInvitations)
        .set({
          status: 'REVOKED',
        })
        .where(eq(schema.organizationInvitations.id, invitation.id));

      throw new InternalServerErrorException(
        'Invitation was created but email could not be sent',
      );
    }

    // 15. Safe response
    return {
      message: 'Invitation created and email queued successfully',

      invitation: {
        id: invitation.id,

        organizationId: invitation.organizationId,

        email: invitation.email,

        role: invitation.role,

        status: invitation.status,

        expiresAt: invitation.expiresAt,

        createdAt: invitation.createdAt,
      },
    };
  }

  async accept(clerkUserId: string, token: string) {
    // 1. Hash incoming raw token
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // 2. Find invitation
    const invitation =
      await this.databaseService.db.query.organizationInvitations.findFirst({
        where: (invitations, { eq }) => eq(invitations.tokenHash, tokenHash),
      });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // 3. Check invitation status
    if (invitation.status !== 'PENDING') {
      throw new ConflictException('Invitation is no longer pending');
    }

    // 4. Check expiration
    if (invitation.expiresAt.getTime() < Date.now()) {
      await this.databaseService.db
        .update(schema.organizationInvitations)
        .set({
          status: 'EXPIRED',
        })
        .where(eq(schema.organizationInvitations.id, invitation.id));

      throw new GoneException('Invitation has expired');
    }

    // 5. Get logged-in DevFlow user
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    // 6. Invitation must belong to same email
    const currentUserEmail = currentUser.email.trim().toLowerCase();

    const invitationEmail = invitation.email.trim().toLowerCase();

    if (currentUserEmail !== invitationEmail) {
      throw new ForbiddenException(
        'This invitation belongs to another email address',
      );
    }

    // 7. Check if already a member
    const existingMembership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, invitation.organizationId),
            eq(members.userId, currentUser.id),
          ),
      });

    if (existingMembership) {
      throw new ConflictException(
        'You are already a member of this organization',
      );
    }

    // 8. Membership + invitation update transaction
    const result = await this.databaseService.db.transaction(async (tx) => {
      const [membership] = await tx
        .insert(schema.organizationMembers)
        .values({
          organizationId: invitation.organizationId,

          userId: currentUser.id,

          role: invitation.role,
        })
        .returning();

      const [acceptedInvitation] = await tx
        .update(schema.organizationInvitations)
        .set({
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        })
        .where(
          and(
            eq(schema.organizationInvitations.id, invitation.id),
            eq(schema.organizationInvitations.status, 'PENDING'),
          ),
        )
        .returning();

      if (!acceptedInvitation) {
        throw new ConflictException('Invitation has already been processed');
      }

      return {
        membership,
        invitation: acceptedInvitation,
      };
    });

    return {
      message: 'Invitation accepted successfully',

      membership: {
        id: result.membership.id,

        organizationId: result.membership.organizationId,

        userId: result.membership.userId,

        role: result.membership.role,

        joinedAt: result.membership.joinedAt,
      },
    };
  }
  async findAllForOrganization(clerkUserId: string, organizationId: string) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    const membership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, currentUser.id),
          ),
      });

    if (!membership) {
      throw new NotFoundException('Organization not found');
    }

    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to view invitations',
      );
    }

    const invitations =
      await this.databaseService.db.query.organizationInvitations.findMany({
        where: (invitations, { eq }) =>
          eq(invitations.organizationId, organizationId),

        orderBy: (invitations, { desc }) => [desc(invitations.createdAt)],
      });

    return invitations.map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      acceptedAt: invitation.acceptedAt,
      createdAt: invitation.createdAt,
    }));
  }
  async revoke(
    clerkUserId: string,
    organizationId: string,
    invitationId: string,
  ) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    const membership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, currentUser.id),
          ),
      });

    if (!membership) {
      throw new NotFoundException('Organization not found');
    }

    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to revoke invitations',
      );
    }

    const invitation =
      await this.databaseService.db.query.organizationInvitations.findFirst({
        where: (invitations, { and, eq }) =>
          and(
            eq(invitations.id, invitationId),
            eq(invitations.organizationId, organizationId),
          ),
      });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== 'PENDING') {
      throw new ConflictException('Only pending invitations can be revoked');
    }

    const [revokedInvitation] = await this.databaseService.db
      .update(schema.organizationInvitations)
      .set({
        status: 'REVOKED',
      })
      .where(
        and(
          eq(schema.organizationInvitations.id, invitationId),
          eq(schema.organizationInvitations.organizationId, organizationId),
          eq(schema.organizationInvitations.status, 'PENDING'),
        ),
      )
      .returning();

    if (!revokedInvitation) {
      throw new ConflictException('Invitation has already been processed');
    }

    return {
      message: 'Invitation revoked successfully',

      invitation: {
        id: revokedInvitation.id,
        email: revokedInvitation.email,
        role: revokedInvitation.role,
        status: revokedInvitation.status,
      },
    };
  }
}
