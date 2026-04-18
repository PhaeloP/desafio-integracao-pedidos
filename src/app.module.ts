import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { DocumentosModule } from './modules/documentos/documentos.module';
import { ExamesModule } from './modules/exames/exames.module';

@Module({
  imports: [
    DatabaseModule,
    PedidosModule,
    DocumentosModule,
    ExamesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}