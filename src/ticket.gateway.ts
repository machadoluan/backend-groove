// ticket.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TicketGateway {
  @WebSocketServer()
  server: Server;

  // Método para emitir nova mensagem
  emitNewMessage(ticketId: number, message: any) {
    this.server.emit(`ticket-${ticketId}`, message);
  }
}
