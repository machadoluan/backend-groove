import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Novidades {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    fotoLink: string; // Este campo deve ser único e do tipo string

    @Column()
    videoLink: string;

    @Column({ nullable: true })
    video: boolean;
}
