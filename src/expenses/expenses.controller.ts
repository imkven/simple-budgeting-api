import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { okResponse, TokenPayload } from 'src/handy';
import { Auth } from 'src/auth/ auth.decorator';

@ApiTags('expenses')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create expense record.' })
  async create(@Auth() { userId }: TokenPayload, @Body() inputs: CreateExpenseDto) {
    const data = await this.expensesService.create(userId, inputs);
    return okResponse(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expense records.' })
  async findAll(@Auth() { userId }: TokenPayload) {
    const data = await this.expensesService.findAll(userId);
    return okResponse(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense record.' })
  async findOne(@Auth() { userId }: TokenPayload, @Param('id') id: string) {
    const data = await this.expensesService.findOne(userId, id);
    return okResponse(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update expense record.' })
  async update(@Auth() { userId }: TokenPayload, @Param('id') id: string, @Body() inputs: UpdateExpenseDto) {
    const data = await this.expensesService.update(userId, id, inputs);
    return okResponse(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense record.' })
  async delete(@Auth() { userId }: TokenPayload, @Param('id') id: string) {
    const data = await this.expensesService.delete(userId, id);
    return okResponse(data);
  }
}
