import { Injectable, Logger } from '@nestjs/common';
import { githubWebhookDeliveries } from '@devflow/db';
import { and, eq } from 'drizzle-orm';

import { DatabaseService } from '../../database/database.service.js';

@Injectable()
export class GithubWebhookDeliveryService {
  private readonly logger = new Logger(GithubWebhookDeliveryService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async claimDelivery(
    deliveryId: string,
    event: string,
    action?: string | null,
  ) {
    const db = this.databaseService.db;

    // 1. First attempt: atomically insert a new delivery.
    const [newDelivery] = await db
      .insert(githubWebhookDeliveries)
      .values({
        deliveryId,
        event,
        action: action ?? null,
        status: 'PROCESSING',
      })
      .onConflictDoNothing({
        target: githubWebhookDeliveries.deliveryId,
      })
      .returning();

    if (newDelivery) {
      this.logger.log(
        `GitHub webhook claimed: delivery=${deliveryId} event=${event}`,
      );

      return {
        claimed: true as const,
        delivery: newDelivery,
        retry: false,
      };
    }

    // 2. Existing FAILED delivery can be reclaimed atomically.
    const [retriedDelivery] = await db
      .update(githubWebhookDeliveries)
      .set({
        status: 'PROCESSING',
        event,
        action: action ?? null,
        failedAt: null,
        processedAt: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(githubWebhookDeliveries.deliveryId, deliveryId),
          eq(githubWebhookDeliveries.status, 'FAILED'),
        ),
      )
      .returning();

    if (retriedDelivery) {
      this.logger.warn(
        `Retrying failed GitHub webhook: delivery=${deliveryId}`,
      );

      return {
        claimed: true as const,
        delivery: retriedDelivery,
        retry: true,
      };
    }

    // 3. PROCESSING / COMPLETED delivery = duplicate.
    this.logger.warn(
      `Duplicate GitHub webhook ignored: delivery=${deliveryId}`,
    );

    return {
      claimed: false as const,
      delivery: null,
      retry: false,
    };
  }

  async markCompleted(deliveryId: string) {
    const [delivery] = await this.databaseService.db
      .update(githubWebhookDeliveries)
      .set({
        status: 'COMPLETED',
        processedAt: new Date(),
        failedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(githubWebhookDeliveries.deliveryId, deliveryId))
      .returning();

    return delivery ?? null;
  }

  async markFailed(deliveryId: string) {
    const [delivery] = await this.databaseService.db
      .update(githubWebhookDeliveries)
      .set({
        status: 'FAILED',
        failedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(githubWebhookDeliveries.deliveryId, deliveryId))
      .returning();

    return delivery ?? null;
  }
}
