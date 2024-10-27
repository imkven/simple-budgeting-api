import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IncomesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  
  async create(userId: string, inputs: CreateIncomeDto) {
    const { date, description , amount } = inputs;
    return this.prismaService.income.create({
      data: {
        userId,
        date,
        description,
        amount,
      },
    });
  }

  async findAll(userId: string) {
    return this.prismaService.income.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        description: true,
        amount: true,
        date: true,
      },
    });
  }

  async findOne(userId: string, id: string) {
    const income = await this.prismaService.income.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
        description: true,
        amount: true,
        date: true,
      },
    });
    if (!income) {
      throw new NotFoundException ('No income record found');
    }
    return income;
  }

  async update(userId: string, id: string, inputs: UpdateIncomeDto) {
    const income = await this.prismaService.income.findFirst({
      where: {
        id,
        userId,
      },
      select: { id: true, userId: true }
    });
    if (!income) {
      throw new NotFoundException('No income record found');
    }
    return this.prismaService.income.update({
      where: { id },
      data: inputs,
    });
  }

  async delete(userId: string, id: string) {
    const income = await this.prismaService.income.findFirst({
      where: {
        id,
        userId,
      },
      select: { id: true, userId: true }
    });
    if (!income) {
      throw new NotFoundException('No income record found');
    }
    return this.prismaService.income.delete({
      where: { id: income.id },
    });
  }
}
