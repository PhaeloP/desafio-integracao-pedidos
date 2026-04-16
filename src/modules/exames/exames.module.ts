import { Module } from '@nestjs/common';
import { ExamesController } from './exames.controller';

@Module({
  controllers: [ExamesController]
})
export class ExamesModule {}
