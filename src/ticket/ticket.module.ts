// ticket.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketMessage } from './entity/ticket-message.entity';
import { Ticket } from './entity/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketMessage])],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule { }
