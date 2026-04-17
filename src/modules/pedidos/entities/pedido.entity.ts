import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PedidoExame } from './pedido-exame.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigoPedido: number;

  @Column()
  nomePaciente: string;

  @Column()
  dataNascimento: string;

  @Column()
  sexo: string;

  @Column()
  codUnidade: number;

  @Column({ default: false })
  integrado: boolean;

  @OneToMany(() => PedidoExame, (pe) => pe.pedido)
  exames: PedidoExame[];
}