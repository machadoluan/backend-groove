import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AnalyticsLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event: string; // Ex: 'acesso_site', 'clique_discord', etc.

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  ip?: string;

  @CreateDateColumn()
  createdAt: Date;
}