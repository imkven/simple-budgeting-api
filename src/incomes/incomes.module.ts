import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [IncomesController],
  providers: [IncomesService, PrismaService],
})
export class IncomesModule {}
