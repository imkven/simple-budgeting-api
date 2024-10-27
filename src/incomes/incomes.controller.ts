import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { okResponse, TokenPayload } from 'src/handy';
import { Auth } from 'src/auth/ auth.decorator';

@ApiTags('incomes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  @ApiOperation({ summary: 'Create income record.' })
  async create(@Auth() { userId }: TokenPayload, @Body() inputs: CreateIncomeDto) {
    const data = await this.incomesService.create(userId, inputs);
    return okResponse(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all income records.' })
  async findAll(@Auth() { userId }: TokenPayload) {
    const data = await this.incomesService.findAll(userId);
    return okResponse(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get income record.' })
  async findOne(@Auth() { userId }: TokenPayload, @Param('id') id: string) {
    const data = await this.incomesService.findOne(userId, id);
    return okResponse(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update income record.' })
  async update(@Auth() { userId }: TokenPayload, @Param('id') id: string, @Body() inputs: UpdateIncomeDto) {
    const data = await this.incomesService.update(userId, id, inputs);
    return okResponse(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete income record.' })
  async delete(@Auth() { userId }: TokenPayload, @Param('id') id: string) {
    const data = await this.incomesService.delete(userId, id);
    return okResponse(data);
  }
}
