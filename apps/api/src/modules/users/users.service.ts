import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/backend';

import { DatabaseService } from '../../database/database.service.js';
import { schema } from '@devflow/db';

@Injectable()
export class UsersService {
  private readonly clerkClient;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {
    const secretKey = this.configService.getOrThrow<string>('CLERK_SECRET_KEY');

    this.clerkClient = createClerkClient({
      secretKey,
    });
  }

  async syncCurrentUser(clerkUserId: string) {
    const clerkUser = await this.clerkClient.users.getUser(clerkUserId);

    const primaryEmail =
      clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

    if (!primaryEmail) {
      throw new Error('Clerk user has no email address');
    }

    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
      clerkUser.username ||
      primaryEmail.split('@')[0];

    const [user] = await this.databaseService.db
      .insert(schema.users)
      .values({
        externalAuthId: clerkUser.id,
        email: primaryEmail,
        name,
        avatarUrl: clerkUser.imageUrl ?? null,
      })
      .onConflictDoUpdate({
        target: schema.users.externalAuthId,
        set: {
          email: primaryEmail,
          name,
          avatarUrl: clerkUser.imageUrl ?? null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return user;
  }

  async findByClerkId(clerkUserId: string) {
    const user = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
