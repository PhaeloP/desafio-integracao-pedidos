import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  create(@Body() dto: CreatePedidoDto) {
    return this.pedidosService.create(dto);
  }

  @Get(':codigoPedido')
  findOne(@Param('codigoPedido') codigoPedido: string) {
    return this.pedidosService.findOneByCodigo(Number(codigoPedido));
  }
}