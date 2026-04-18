import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Documento } from './entities/documento.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { PedidoExame } from '../pedidos/entities/pedido-exame.entity';
import { Exame } from '../exames/entities/exame.entity';
import { DocumentoExame } from './entities/documento-exame.entity';
import { CreateDocumentoDto } from './dto/create-documento.dto';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectRepository(Documento)
    private readonly documentoRepo: Repository<Documento>,

    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,

    @InjectRepository(PedidoExame)
    private readonly pedidoExameRepo: Repository<PedidoExame>,

    @InjectRepository(Exame)
    private readonly exameRepo: Repository<Exame>,

    @InjectRepository(DocumentoExame)
    private readonly documentoExameRepo: Repository<DocumentoExame>,
  ) {}

  async create(dto: CreateDocumentoDto) {
    // 1. Evitar duplicidade
    const existe = await this.documentoRepo.findOne({
      where: {
        codigoDocumento: dto.CodigoDocumento,
        codigoPedido: dto.CodigoPedido,
      },
    });

    if (existe) {
      throw new BadRequestException('Documento duplicado');
    }

    // 2. Criar documento
    let documento = this.documentoRepo.create({
      codigoDocumento: dto.CodigoDocumento,
      codigoPedido: dto.CodigoPedido,
      nomeDocumento: dto.NomeDocumento,
      documento: dto.Documento,
      integrado: false,
    });

    documento = await this.documentoRepo.save(documento);

    // 3. Verificar se pedido já está integrado
    const pedido = await this.pedidoRepo.findOne({
      where: { codigoPedido: dto.CodigoPedido },
    });

    if (pedido?.integrado) {
      // pegar exames do pedido
      const pedidoExames = await this.pedidoExameRepo.find({
        where: { pedido: { id: pedido.id } },
        relations: ['pedido'],
      });

      for (const pe of pedidoExames) {
        const exame = await this.exameRepo.findOne({
          where: { accessionNumber: pe.accessionNumber },
        });

        if (exame) {
          const vinculoExistente = await this.documentoExameRepo
            .createQueryBuilder('de')
            .leftJoin('de.documento', 'documento')
            .leftJoin('de.exame', 'exame')
            .where('documento.id = :docId', { docId: documento.id })
            .andWhere('exame.id = :exameId', { exameId: exame.id })
            .getOne();

          if (!vinculoExistente) {
            const vinculo = this.documentoExameRepo.create({
              documento,
              exame,
            });

            await this.documentoExameRepo.save(vinculo);
          }
        }
      }

      documento.integrado = true;
      await this.documentoRepo.save(documento);
    }

    return documento;
  }

  async findByCodigoPedido(codigoPedido: number) {
    return this.documentoRepo.find({
      where: { codigoPedido },
    });
  }
}