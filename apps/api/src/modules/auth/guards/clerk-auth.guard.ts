import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
  };
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const token = authorization.slice(7);

    try {
      const secretKey =
        this.configService.getOrThrow<string>('CLERK_SECRET_KEY');

      const payload = await verifyToken(token, {
        secretKey,
      });

      if (!payload.sub) {
        throw new UnauthorizedException('Invalid authentication token');
      }

      request.auth = {
        userId: payload.sub,
      };

      return true;
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired authentication token',
      );
    }
  }
}
