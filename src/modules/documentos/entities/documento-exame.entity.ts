import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Documento } from './documento.entity';
import { Exame } from '../../exames/entities/exame.entity';

@Entity('documento_exames')
@Unique(['documento', 'exame'])
export class DocumentoExame {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Documento, { onDelete: 'CASCADE' })
  documento: Documento;

  @ManyToOne(() => Exame, { onDelete: 'CASCADE' })
  exame: Exame;
}