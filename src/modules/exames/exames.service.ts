import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exame } from './entities/exame.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { PedidoExame } from '../pedidos/entities/pedido-exame.entity';
import { Documento } from '../documentos/entities/documento.entity';
import { DocumentoExame } from '../documentos/entities/documento-exame.entity';
import { CreateExameDto } from './dto/create-exame.dto';

@Injectable()
export class ExamesService {
  constructor(
    @InjectRepository(Exame)
    private readonly exameRepo: Repository<Exame>,

    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,

    @InjectRepository(PedidoExame)
    private readonly pedidoExameRepo: Repository<PedidoExame>,

    @InjectRepository(Documento)
    private readonly documentoRepo: Repository<Documento>,

    @InjectRepository(DocumentoExame)
    private readonly documentoExameRepo: Repository<DocumentoExame>,
  ) {}

  async create(dto: CreateExameDto) {
    let exame = await this.exameRepo.findOne({
      where: { accessionNumber: dto.AccessionNumber },
    });

    if (!exame) {
      exame = this.exameRepo.create({
        accessionNumber: dto.AccessionNumber,
        nomePaciente: dto.NomePaciente,
        modalidade: dto.Modalidade,
        nomeProcedimento: dto.NomeProcedimento,
      });

      exame = await this.exameRepo.save(exame);
    }

    const pedidoExame = await this.pedidoExameRepo
      .createQueryBuilder('pedidoExame')
      .leftJoinAndSelect('pedidoExame.pedido', 'pedido')
      .where('pedidoExame.accessionNumber = :accessionNumber', {
        accessionNumber: dto.AccessionNumber,
      })
      .getOne();

    if (pedidoExame?.pedido) {
      const pedido = pedidoExame.pedido;

      if (!pedido.integrado) {
        pedido.integrado = true;
        await this.pedidoRepo.save(pedido);
      }

      const documentosPendentes = await this.documentoRepo.find({
        where: {
          codigoPedido: pedido.codigoPedido,
          integrado: false,
        },
      });

      for (const documento of documentosPendentes) {
        const vinculoExistente = await this.documentoExameRepo
          .createQueryBuilder('documentoExame')
          .leftJoin('documentoExame.documento', 'documento')
          .leftJoin('documentoExame.exame', 'exame')
          .where('documento.id = :documentoId', { documentoId: documento.id })
          .andWhere('exame.id = :exameId', { exameId: exame.id })
          .getOne();

        if (!vinculoExistente) {
          const vinculo = this.documentoExameRepo.create({
            documento,
            exame,
          });

          await this.documentoExameRepo.save(vinculo);
        }

        documento.integrado = true;
        await this.documentoRepo.save(documento);
      }
    }

    return exame;
  }

  async findByAccessionNumber(accessionNumber: string) {
    const exame = await this.exameRepo.findOne({
      where: { accessionNumber },
    });

    if (!exame) {
      throw new Error('Exame não encontrado');
    }

    return exame;
  }
}