import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExamesService } from './exames.service';
import { CreateExameDto } from './dto/create-exame.dto';

@Controller('exames')
export class ExamesController {
  constructor(private readonly examesService: ExamesService) {}

  @Post()
  create(@Body() dto: CreateExameDto) {
    return this.examesService.create(dto);
  }

  @Get(':accessionNumber')
  findOne(@Param('accessionNumber') accessionNumber: string) {
    return this.examesService.findByAccessionNumber(accessionNumber);
  }
}