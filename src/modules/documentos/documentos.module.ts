import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';

import { Documento } from './entities/documento.entity';
import { DocumentoExame } from './entities/documento-exame.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { PedidoExame } from '../pedidos/entities/pedido-exame.entity';
import { Exame } from '../exames/entities/exame.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Documento,
      DocumentoExame,
      Pedido,
      PedidoExame,
      Exame,
    ]),
  ],
  controllers: [DocumentosController],
  providers: [DocumentosService],
})
export class DocumentosModule {}