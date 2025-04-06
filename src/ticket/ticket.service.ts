// ticket.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketMessage, MessageSender } from './entity/ticket-message.entity';
import { Ticket, TicketStatus } from './entity/ticket.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketMessage)
    private ticketMessageRepository: Repository<TicketMessage>,
  ) {}

  async createTicket(userId: number, description: string, subject: string, motivo: string, url: string): Promise<Ticket> {
    // Cria o ticket sem a descrição, pois ela será a primeira mensagem
    const ticket = this.ticketRepository.create({ userId, status: TicketStatus.OPEN, subject: subject, motivo: motivo, url: url });
    const savedTicket = await this.ticketRepository.save(ticket);

    // Cria a primeira mensagem com a descrição fornecida
    const firstMessage = this.ticketMessageRepository.create({
      sender: MessageSender.USER,
      message: description,
      ticket: savedTicket,
    });
    await this.ticketMessageRepository.save(firstMessage);

    // Atualiza o ticket para incluir a mensagem no relacionamento (opcional)
    savedTicket.messages = [firstMessage];
    return savedTicket;
  }

  async getTicketsByUser(userId: number): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { userId },
      relations: ['messages'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTicketById(ticketId: number): Promise<Ticket> {
    return this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['messages'],
    });
  }

  async assignTicket(ticketId: number, adminId: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new Error('Ticket não encontrado');
    }
    ticket.adminId = adminId;
    ticket.status = TicketStatus.ASSIGNED;
    return this.ticketRepository.save(ticket);
  }

  async addMessage(ticketId: number, sender: MessageSender, message: string): Promise<TicketMessage> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new Error('Ticket não encontrado');
    }
    const ticketMessage = this.ticketMessageRepository.create({
      sender,
      message,
      ticket,
    });
    return this.ticketMessageRepository.save(ticketMessage);
  }
}
