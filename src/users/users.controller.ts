import { Controller, Get, Put, Param, UseGuards, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { okResponse, TokenPayload } from 'src/handy';
import { Auth } from 'src/auth/ auth.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Get display name.' })
  async me(@Auth() { userId }: TokenPayload) {
    const data = await this.usersService.me(userId);
    return okResponse(data);
  }

  @Put('/me')
  @ApiOperation({ summary: 'Update display name.' })
  async update(@Auth() { userId }: TokenPayload, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(userId, updateUserDto);
    return okResponse(data);
  }
}
