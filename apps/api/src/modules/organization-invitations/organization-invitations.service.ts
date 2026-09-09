import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  GoneException,
} from '@nestjs/common';

import { createHash, randomBytes } from 'node:crypto';
import { and, eq } from 'drizzle-orm';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';

import { CreateOrganizationInvitationDto } from './dto/create-organization-invitation.dto.js';

@Injectable()
export class OrganizationInvitationsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    clerkUserId: string,
    organizationId: string,
    dto: CreateOrganizationInvitationDto,
  ) {
    // 1. Current logged-in user
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    // 2. Check current user's organization membership
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

    // 3. Only OWNER or ADMIN can invite
    if (
      currentMembership.role !== 'OWNER' &&
      currentMembership.role !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You do not have permission to invite members',
      );
    }

    const email = dto.email.trim().toLowerCase();

    // 4. Check if email belongs to existing DevFlow user
    const targetUser = await this.usersService.findOptionalByEmail(email);

    // 5. If user exists, check if already organization member
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

    // 6. Check existing pending invitation
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
      throw new ConflictException(
        'A pending invitation already exists for this email',
      );
    }

    // 7. Generate secure invitation token
    const token = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256').update(token).digest('hex');

    // 8. Invite expires after 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // 9. Store invitation
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

    // Temporary.
    // Later this URL will be sent through email.
    const inviteUrl = `http://localhost:3000/invitations/${token}`;

    return {
      message: 'Invitation created successfully',

      invitation: {
        id: invitation.id,
        organizationId: invitation.organizationId,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
      },

      inviteUrl,
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
}
