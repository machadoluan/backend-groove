// ticket.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TicketMessage } from './ticket-message.entity';

export enum TicketStatus {
  OPEN = 'Aberto',
  ASSIGNED = 'Ativo',
  CLOSED = 'Fechado',
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  adminId?: number;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column({ type: 'text' })
  subject: string;

  @Column({ type: 'text' })
  motivo: string;

  @Column({ type: 'text' })
  url: string;

  @OneToMany(() => TicketMessage, (message) => message.ticket, { cascade: true })
  messages: TicketMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
