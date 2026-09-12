import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';
import { Server, Socket } from 'socket.io';
import { DatabaseService } from '../../database/database.service.js';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        this.extractBearerToken(client.handshake.headers.authorization);

      if (!token) {
        console.log(`Socket rejected: missing token (${client.id})`);
        client.disconnect(true);
        return;
      }

      const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');

      if (!secretKey) {
        console.error('CLERK_SECRET_KEY is not configured');
        client.disconnect(true);
        return;
      }

      const payload = await verifyToken(token, {
        secretKey,
        authorizedParties: ['http://localhost:3000'],
      });

      client.data.userId = payload.sub;

      console.log(`Socket authenticated: ${client.id} user=${payload.sub}`);
    } catch {
      console.log(`Socket rejected: invalid token (${client.id})`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:organization')
  async handleJoinOrganization(
    @ConnectedSocket() client: Socket,
    @MessageBody() organizationId: string,
  ) {
    const clerkUserId = client.data.userId as string | undefined;

    if (!clerkUserId) {
      return {
        event: 'error',
        data: {
          message: 'Unauthorized',
        },
      };
    }

    const user = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!user) {
      return {
        event: 'error',
        data: {
          message: 'User not found',
        },
      };
    }

    const membership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, user.id),
          ),
      });

    if (!membership) {
      return {
        event: 'error',
        data: {
          message: 'Access denied',
        },
      };
    }

    await client.join(`organization:${organizationId}`);

    return {
      event: 'joined:organization',
      data: {
        organizationId,
        role: membership.role,
      },
    };
  }

  @SubscribeMessage('join:project')
  async handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      organizationId: string;
      projectId: string;
    },
  ) {
    const clerkUserId = client.data.userId as string | undefined;

    if (!clerkUserId) {
      return {
        event: 'error',
        data: {
          message: 'Unauthorized',
        },
      };
    }

    const user = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!user) {
      return {
        event: 'error',
        data: {
          message: 'User not found',
        },
      };
    }

    const membership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, payload.organizationId),
            eq(members.userId, user.id),
          ),
      });

    if (!membership) {
      return {
        event: 'error',
        data: {
          message: 'Access denied',
        },
      };
    }

    const project = await this.databaseService.db.query.projects.findFirst({
      where: (projects, { and, eq }) =>
        and(
          eq(projects.id, payload.projectId),
          eq(projects.organizationId, payload.organizationId),
        ),
    });

    if (!project) {
      return {
        event: 'error',
        data: {
          message: 'Project not found',
        },
      };
    }

    const room = `project:${payload.organizationId}:${payload.projectId}`;

    await client.join(room);

    return {
      event: 'joined:project',
      data: {
        organizationId: payload.organizationId,
        projectId: payload.projectId,
        role: membership.role,
      },
    };
  }

  private extractBearerToken(authorization?: string): string | undefined {
    if (!authorization) {
      return undefined;
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }
}
