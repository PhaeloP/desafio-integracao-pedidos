import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';

import { Pedido } from './entities/pedido.entity';
import { PedidoExame } from './entities/pedido-exame.entity';
import { Exame } from '../exames/entities/exame.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoExame, Exame])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}