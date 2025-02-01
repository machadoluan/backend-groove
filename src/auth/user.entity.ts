import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  nome: string;

  @Column({ unique: true })
  discordId: string; // Este campo deve ser único e do tipo string

  @Column()
  email: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  dataNascimento: string;

  @Column({ nullable: true })
  indicacao: string;
}
