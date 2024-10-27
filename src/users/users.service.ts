import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  me(userId: string) {
    return this.prismaService.user.findFirst({
      where: {
        id : userId,
      },
      select: {
        id: true,
        displayName: true
      }
    });
  }

  update(userId: string, inputs: UpdateUserDto) {
    return this.prismaService.user.update({
      where : { id: userId },
      data : { displayName: inputs.displayName }
    });
  }
}
