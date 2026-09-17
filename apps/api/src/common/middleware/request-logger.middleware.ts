import { Injectable, Logger, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const incomingRequestId = request.header('x-request-id');

    const requestId = incomingRequestId?.trim() || randomUUID();

    response.setHeader('X-Request-Id', requestId);

    const startedAt = process.hrtime.bigint();

    response.on('finish', () => {
      const finishedAt = process.hrtime.bigint();

      const durationMs = Number(finishedAt - startedAt) / 1_000_000;

      this.logger.log(
        `[${requestId}] ${request.method} ${request.originalUrl} ` +
          `${response.statusCode} ${durationMs.toFixed(2)}ms`,
      );
    });

    next();
  }
}
