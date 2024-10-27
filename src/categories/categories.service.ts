import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(userId: string, inputs: CreateCategoryDto) {
    return this.prismaService.category.create({
      data: {
        ...inputs,
        userId
      }
    });
  }

  async findAll(userId: string) {
    return this.prismaService.category.findMany({
      where: {
        // Show user created categories and system preset categories
        OR: [ { userId }, { userId: null } ]
      },
    });
  }

  async findOne(userId: string, id: string) {
    const category = this.prismaService.category.findFirst({
      where: {
        id,
        // Show user created category and system preset category
        OR: [ { userId }, { userId: null } ]
      }
    });
    if ( !category ) {
      throw new NotFoundException ('No Category Found');
    }
    return category;
  }

  async update(userId: string, id: string, inputs: UpdateCategoryDto) {
    const category = await this.prismaService.category.findFirst({
      where: {
        id,
      },
      select: { id: true, userId: true }
    });
    if (!category) {
      throw new NotFoundException('No Category Found');
    }
    // Allow to update user created category only
    if (userId !== category?.userId) {
      throw new ForbiddenException('Not allow to update.');
    };
    return this.prismaService.category.update({
      where: { id: category.id },
      data: inputs,
    });
  }

  async delete(userId: string , id: string) {
    const category = await this.prismaService.category.findFirst({
      where: {
        id,
      },
      select: { id: true, userId: true }
    });
    if (!category) {
      throw new NotFoundException('No Category Found');
    }
    // Allow to delete user created category only
    if (userId !== category?.userId) {
      throw new ForbiddenException('Not allow to delete.');
    };
    return this.prismaService.category.delete({
      where: { id: category.id, userId: { not: null } },
    });
  }
}
