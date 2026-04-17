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
      where: { codigoPedido: dto.CodigoPedido },
      relations: ['exames'],
    });

    if (!pedido) {
      pedido = this.pedidoRepo.create({
        codigoPedido: dto.CodigoPedido,
        nomePaciente: dto.NomePaciente,
        dataNascimento: dto.DataNascimento,
        sexo: dto.Sexo,
        codUnidade: dto.CodUnidade,
        integrado: false,
      });

      pedido = await this.pedidoRepo.save(pedido);
    }

    for (const exameDto of dto.Exames) {
      const existe = await this.pedidoExameRepo
        .createQueryBuilder('pedidoExame')
        .leftJoin('pedidoExame.pedido', 'pedido')
        .where('pedido.id = :pedidoId', { pedidoId: pedido.id })
        .andWhere('pedidoExame.accessionNumber = :accessionNumber', {
          accessionNumber: exameDto.AccessionNumber,
        })
        .getOne();

      if (!existe) {
        const novoExamePedido = this.pedidoExameRepo.create({
          codigoItemPedido: exameDto.CodigoItemPedido,
          accessionNumber: exameDto.AccessionNumber,
          modalidade: exameDto.Modalidade,
          nomeProcedimento: exameDto.NomeProcedimento,
          pedido,
        });

        await this.pedidoExameRepo.save(novoExamePedido);
      }
    }

    let integrado = false;

    for (const exameDto of dto.Exames) {
      const exameExistente = await this.exameRepo.findOne({
        where: { accessionNumber: exameDto.AccessionNumber },
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