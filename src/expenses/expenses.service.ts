import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateIncomeDto } from 'src/incomes/dto/update-income.dto';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  
  async create(userId: string, inputs: CreateExpenseDto) {
    const { categoryId, date, description , amount } = inputs;
    const category = await this.prismaService.category.findFirst({
      where: {
        id : categoryId,
        OR: [
          { userId },
          { userId: null},
        ],
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.prismaService.expense.create({
      data: {
        categoryId,
        userId,
        date,
        description,
        amount,
      },
    });
  }

  findAll(userId: string) {
    return this.prismaService.expense.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        description: true,
        amount: true,
        date: true,
        category: {
          select: { id : true, name: true },
        },
      },
    });
  }
  
  async findOne(userId: string, id: string) {
    const expense = await this.prismaService.expense.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
        description: true,
        amount: true,
        date: true,
        category: {
          select: { id : true, name: true },
        },
      },
    });
    if (!expense) {
      throw new NotFoundException ('No expense record found');
    }
    return expense;
  }

  async update(userId: string, id: string, inputs: UpdateExpenseDto) {
    const { categoryId } = inputs;
    const expense = await this.prismaService.expense.findFirst({
      where: {
        id,
        userId,
      },
      select: { id: true, userId: true }
    });
    if (!expense) {
      throw new NotFoundException('No expense record found');
    }
    const category = await this.prismaService.category.findFirst({
      where: {
        id : categoryId,
        OR: [
          { userId },
          { userId: null},
        ],
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.prismaService.expense.update({
      where: { id },
      data: inputs,
    });
  }

  async delete(userId: string, id: string) {
    const expense = await this.prismaService.expense.findFirst({
      where: {
        id,
        userId,
      },
      select: { id: true, userId: true }
    });
    if (!expense) {
      throw new NotFoundException('No expense record found');
    }
    return this.prismaService.expense.delete({
      where: { id: expense.id },
    });
  }
}
