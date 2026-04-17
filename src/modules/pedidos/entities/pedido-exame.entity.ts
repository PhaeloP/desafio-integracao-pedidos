import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity('pedido_exames')
@Unique(['pedido', 'accessionNumber'])
export class PedidoExame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigoItemPedido: number;

  @Column()
  accessionNumber: string;

  @Column()
  modalidade: string;

  @Column()
  nomeProcedimento: string;

  @ManyToOne(() => Pedido, (pedido) => pedido.exames, { onDelete: 'CASCADE' })
  pedido: Pedido;
}