import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/events', cors: { origin: '*' } })
export class EventsGateway {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() payload: string, @ConnectedSocket() client: Socket) {
    this.logger.debug(`Received ping from ${client.id} -> ${payload}`);
    client.emit('pong', { timestamp: Date.now() });
  }

  broadcast(channel: string, data: unknown) {
    this.server.emit(channel, data);
  }
}
