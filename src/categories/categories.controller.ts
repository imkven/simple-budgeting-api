import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { okResponse, TokenPayload } from 'src/handy';
import { Auth } from 'src/auth/ auth.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a category.' })
  async create(@Auth() tokenPayload: TokenPayload, @Body() inputs: CreateCategoryDto) {
    const data = await this.categoriesService.create(tokenPayload.userId, inputs);
    return okResponse(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category.' })
  async update(@Auth() tokenPayload: TokenPayload, @Param('id') id: string, @Body() inputs: UpdateCategoryDto) {
    const data = await  this.categoriesService.update(tokenPayload.userId, id, inputs);
    return okResponse(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories.' })
  async findAll(@Auth() tokenPayload: TokenPayload) {
    const data = await this.categoriesService.findAll(tokenPayload.userId);
    return okResponse(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id.' })
  async findOne(@Auth() tokenPayload: TokenPayload, @Param('id') id: string) {
    const data = await this.categoriesService.findOne(tokenPayload.userId, id);
    return okResponse(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category.' })
  async delete(@Auth() tokenPayload: TokenPayload, @Param('id') id: string) {
    const data = await this.categoriesService.delete(tokenPayload.userId, id);
    return okResponse(data);
  }
}
