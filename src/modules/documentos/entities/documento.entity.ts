import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('documentos')
@Unique(['codigoDocumento', 'codigoPedido'])
export class Documento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigoDocumento: number;

  @Column()
  codigoPedido: number;

  @Column()
  nomeDocumento: string;

  @Column('text')
  documento: string;

  @Column({ default: false })
  integrado: boolean;
}