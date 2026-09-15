import { Injectable, Logger } from '@nestjs/common';
import { githubWebhookDeliveries } from '@devflow/db';
import { eq } from 'drizzle-orm';

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

    const [delivery] = await db
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

    if (!delivery) {
      this.logger.warn(
        `Duplicate GitHub webhook ignored: delivery=${deliveryId}`,
      );

      return {
        claimed: false as const,
        delivery: null,
      };
    }

    this.logger.log(
      `GitHub webhook claimed: delivery=${deliveryId} event=${event}`,
    );

    return {
      claimed: true as const,
      delivery,
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
