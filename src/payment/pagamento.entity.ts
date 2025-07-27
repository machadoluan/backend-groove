// pagamento.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('pagamentos')
export class Pagamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentId: string;

  @Column()
  email: string;

  @Column()
  nome: string;

  @Column()
  valor: number;

  @Column('text')
  itens: string;

  @Column()
  status: string;

  @CreateDateColumn()
  data: Date;
}
