import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('exames')
export class Exame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  accessionNumber: string;

  @Column()
  nomePaciente: string;

  @Column()
  modalidade: string;

  @Column()
  status: string;
}