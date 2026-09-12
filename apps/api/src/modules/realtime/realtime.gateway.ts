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

  constructor(private readonly configService: ConfigService) {}

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
  handleJoinOrganization(
    @ConnectedSocket() client: Socket,
    @MessageBody() organizationId: string,
  ) {
    if (!client.data.userId) {
      return {
        event: 'error',
        data: {
          message: 'Unauthorized',
        },
      };
    }

    client.join(`organization:${organizationId}`);

    return {
      event: 'joined:organization',
      data: {
        organizationId,
      },
    };
  }

  @SubscribeMessage('join:project')
  handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      organizationId: string;
      projectId: string;
    },
  ) {
    if (!client.data.userId) {
      return {
        event: 'error',
        data: {
          message: 'Unauthorized',
        },
      };
    }

    const room = `project:${payload.organizationId}:${payload.projectId}`;

    client.join(room);

    return {
      event: 'joined:project',
      data: payload,
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
