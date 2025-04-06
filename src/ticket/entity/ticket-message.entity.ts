// ticket-message.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Ticket } from './ticket.entity';

export enum MessageSender {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class TicketMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MessageSender })
  sender: MessageSender;

  @Column({ type: 'text' })
  message: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.messages, { onDelete: 'CASCADE' })
  ticket: Ticket;

  @CreateDateColumn()
  createdAt: Date;
}
