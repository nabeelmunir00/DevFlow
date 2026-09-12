import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

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

  handleConnection(client: Socket) {
    console.log(`Socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:organization')
  handleJoinOrganization(
    @ConnectedSocket() client: Socket,
    @MessageBody() organizationId: string,
  ) {
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
    const room = `project:${payload.organizationId}:${payload.projectId}`;

    client.join(room);

    return {
      event: 'joined:project',
      data: payload,
    };
  }
}
