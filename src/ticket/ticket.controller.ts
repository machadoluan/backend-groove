// ticket.controller.ts
import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { MessageSender, TicketMessage } from './entity/ticket-message.entity';
import { Ticket } from './entity/ticket.entity';
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  // Criação de ticket (a descrição se tornará a primeira mensagem do chat)
  @Post()
  async createTicket(@Body() body: { userId: number; description: string, subject: string, motivo: string, url: string, idDenunciado: number, personagem: string }): Promise<Ticket> {
    const { userId, description, subject, motivo, url, idDenunciado, personagem } = body;
    return this.ticketService.createTicket(userId, description, subject, motivo, url, personagem, idDenunciado );
  }

  // Listagem de tickets por usuário
  @Get('user/:userId')
  async getTicketsByUser(@Param('userId') userId: number): Promise<Ticket[]> {
    return this.ticketService.getTicketsByUser(userId);
  }

  // Detalhes de um ticket (incluindo mensagens)
  @Get(':ticketId')
  async getTicketById(@Param('ticketId') ticketId: number): Promise<Ticket> {
    return this.ticketService.getTicketById(ticketId);
  }

  // Atribuir ticket a um admin
  @Put(':ticketId/assign')
  async assignTicket(@Param('ticketId') ticketId: number, @Body() body: { adminId: number }): Promise<Ticket> {
    const { adminId } = body;
    return this.ticketService.assignTicket(ticketId, adminId);
  }

  // Adicionar mensagem ao ticket
  @Post(':ticketId/messages')
  async addMessage(
    @Param('ticketId') ticketId: number,
    @Body() body: { sender: MessageSender; message: string },
  ): Promise<TicketMessage> {
    const { sender, message } = body;
    return this.ticketService.addMessage(ticketId, sender, message);
  }
}
