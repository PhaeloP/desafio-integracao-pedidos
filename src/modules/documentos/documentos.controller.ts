import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly service: DocumentosService) {}

  @Post()
  create(@Body() dto: CreateDocumentoDto) {
    return this.service.create(dto);
  }

  @Get(':codigoPedido')
  find(@Param('codigoPedido') codigoPedido: string) {
    return this.service.findByCodigoPedido(Number(codigoPedido));
  }
}