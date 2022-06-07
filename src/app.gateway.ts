import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'http';

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('gateway');
  @WebSocketServer() server: Server;
  afterInit(server: Server) {
    this.logger.log(`start ${server}`);
  }

  handleConnection(client: Server, ...args: any[]) {
    this.logger.log(`connected: ${client}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`disconnected: ${client}`);
  }

  @SubscribeMessage('Socket-messages')
  handleMessage(client: any, text: string): void {
    this.server.emit('msgToClient', text);
  }
}
