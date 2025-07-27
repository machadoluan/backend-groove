import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cards {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  title: string;

  @Column({ nullable: true })
  description: string; // Este campo deve ser único e do tipo string

  @Column()
  dateValidade: string;

  @Column({ nullable: true })
  detalis: string;

  @Column({ nullable: true })
  price: string;

  @Column({ nullable: true })
  photo: string;
}
