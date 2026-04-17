import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import { Documento } from './entities/documento.entity';
import { DocumentoExame } from './entities/documento-exame.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Documento, DocumentoExame])],
  controllers: [DocumentosController],
  providers: [DocumentosService],
})
export class DocumentosModule {}