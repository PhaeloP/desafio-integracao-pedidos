import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pedido } from './entities/pedido.entity';
import { PedidoExame } from './entities/pedido-exame.entity';
import { Exame } from '../exames/entities/exame.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,

    @InjectRepository(PedidoExame)
    private readonly pedidoExameRepo: Repository<PedidoExame>,

    @InjectRepository(Exame)
    private readonly exameRepo: Repository<Exame>,
  ) {}

  async create(dto: CreatePedidoDto) {
    let pedido = await this.pedidoRepo.findOne({
      where: { codigoPedido: dto.codigoPedido },
      relations: ['exames'],
    });

    if (!pedido) {
      pedido = this.pedidoRepo.create({
        codigoPedido: dto.codigoPedido,
        nomePaciente: dto.nomePaciente,
        dataNascimento: dto.dataNascimento,
        sexo: dto.sexo,
        codUnidade: dto.codUnidade,
        integrado: false,
      });

      pedido = await this.pedidoRepo.save(pedido);
    }

    for (const exameDto of dto.exams) {
      const existe = await this.pedidoExameRepo
        .createQueryBuilder('pedidoExame')
        .leftJoin('pedidoExame.pedido', 'pedido')
        .where('pedido.id = :pedidoId', { pedidoId: pedido.id })
        .andWhere('pedidoExame.accessionNumber = :accessionNumber', {
          accessionNumber: exameDto.accessionNumber,
        })
        .getOne();

      if (!existe) {
        const novoExamePedido = this.pedidoExameRepo.create({
          codigoItemPedido: exameDto.codigoItemPedido,
          accessionNumber: exameDto.accessionNumber,
          modalidade: exameDto.modalidade,
          nomeProcedimento: exameDto.nomeProcedimento,
          pedido,
        });

        await this.pedidoExameRepo.save(novoExamePedido);
      }
    }

    let integrado = false;

    for (const exameDto of dto.exams) {
      const exameExistente = await this.exameRepo.findOne({
        where: { accessionNumber: exameDto.accessionNumber },
      });

      if (exameExistente) {
        integrado = true;
        break;
      }
    }

    pedido.integrado = integrado;
    await this.pedidoRepo.save(pedido);

    return this.pedidoRepo.findOne({
      where: { id: pedido.id },
      relations: ['exames'],
    });
  }
}