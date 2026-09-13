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

  /**
   * Single-instance presence tracking.
   *
   * clerkUserId -> active socket count
   *
   * Later, when we horizontally scale Socket.IO,
   * this should move to Redis.
   */
  private readonly connectedUsers = new Map<string, number>();

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

      const clerkUserId = payload.sub;

      client.data.userId = clerkUserId;

      await client.join(`user:${clerkUserId}`);

      const currentConnections = this.connectedUsers.get(clerkUserId) ?? 0;

      this.connectedUsers.set(clerkUserId, currentConnections + 1);

      console.log(`Socket authenticated: ${client.id} user=${clerkUserId}`);
    } catch (error) {
      console.error(`Socket authentication failed (${client.id}):`, error);

      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const clerkUserId = client.data.userId as string | undefined;

    if (!clerkUserId) {
      console.log(`Socket disconnected: ${client.id}`);
      return;
    }

    const currentConnections = this.connectedUsers.get(clerkUserId) ?? 0;

    const remainingConnections = Math.max(currentConnections - 1, 0);

    if (remainingConnections === 0) {
      this.connectedUsers.delete(clerkUserId);

      this.broadcastOfflineToJoinedRooms(client, clerkUserId);
    } else {
      this.connectedUsers.set(clerkUserId, remainingConnections);
    }

    console.log(`Socket disconnected: ${client.id} user=${clerkUserId}`);
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

    const room = `organization:${organizationId}`;

    await client.join(room);

    client.to(room).emit('presence:online', {
      organizationId,
      userId: user.id,
      clerkUserId,
      name: user.name,
      email: user.email,
    });

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

    client.to(room).emit('presence:online', {
      organizationId: payload.organizationId,
      projectId: payload.projectId,
      userId: user.id,
      clerkUserId,
      name: user.name,
      email: user.email,
    });

    return {
      event: 'joined:project',
      data: {
        organizationId: payload.organizationId,

        projectId: payload.projectId,

        role: membership.role,
      },
    };
  }

  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      organizationId: string;
      projectId: string;
      taskId?: string;
    },
  ) {
    const user = await this.getAuthenticatedUser(client);

    if (!user) {
      return;
    }

    const room = `project:${payload.organizationId}:${payload.projectId}`;

    if (!client.rooms.has(room)) {
      return {
        event: 'error',
        data: {
          message: 'Join project room before sending typing events',
        },
      };
    }

    client.to(room).emit('typing:start', {
      organizationId: payload.organizationId,

      projectId: payload.projectId,

      taskId: payload.taskId,

      user: {
        id: user.id,
        clerkUserId: user.externalAuthId,

        name: user.name,
      },
    });
  }

  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      organizationId: string;
      projectId: string;
      taskId?: string;
    },
  ) {
    const user = await this.getAuthenticatedUser(client);

    if (!user) {
      return;
    }

    const room = `project:${payload.organizationId}:${payload.projectId}`;

    if (!client.rooms.has(room)) {
      return {
        event: 'error',
        data: {
          message: 'Join project room before sending typing events',
        },
      };
    }

    client.to(room).emit('typing:stop', {
      organizationId: payload.organizationId,

      projectId: payload.projectId,

      taskId: payload.taskId,

      user: {
        id: user.id,
        clerkUserId: user.externalAuthId,

        name: user.name,
      },
    });
  }

  private async getAuthenticatedUser(client: Socket) {
    const clerkUserId = client.data.userId as string | undefined;

    if (!clerkUserId) {
      return null;
    }

    return this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });
  }

  private broadcastOfflineToJoinedRooms(client: Socket, clerkUserId: string) {
    for (const room of client.rooms) {
      if (room.startsWith('organization:') || room.startsWith('project:')) {
        client.to(room).emit('presence:offline', {
          clerkUserId,
        });
      }
    }
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

  emitToProject(
    organizationId: string,
    projectId: string,
    event: string,
    payload: unknown,
  ) {
    const room = `project:${organizationId}:${projectId}`;

    this.server.to(room).emit(event, payload);
  }

  emitToOrganization(organizationId: string, event: string, payload: unknown) {
    const room = `organization:${organizationId}`;

    this.server.to(room).emit(event, payload);
  }

  emitToUser(userId: string, event: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
