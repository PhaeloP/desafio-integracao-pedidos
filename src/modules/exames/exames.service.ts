import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exame } from './entities/exame.entity';
import { Documento } from '../documentos/entities/documento.entity';
import { DocumentoExame } from '../documentos/entities/documento-exame.entity';

import { CreateExameDto } from './dto/create-exame.dto';

@Injectable()
export class ExamesService {
  constructor(
    @InjectRepository(Exame)
    private exameRepo: Repository<Exame>,

    @InjectRepository(Documento)
    private documentoRepo: Repository<Documento>,

    @InjectRepository(DocumentoExame)
    private documentoExameRepo: Repository<DocumentoExame>,
  ) {}

  async create(dto: CreateExameDto) {
    const exame = this.exameRepo.create({
      accessionNumber: dto.AccessionNumber,
      nomePaciente: dto.NomePaciente,
      modalidade: dto.Modalidade,
      nomeProcedimento: dto.NomeProcedimento,
    });

    await this.exameRepo.save(exame);

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