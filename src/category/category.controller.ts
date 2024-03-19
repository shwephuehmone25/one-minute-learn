import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  Post,
} from '@nestjs/common';
import CategoriesService from './category.service';
import CreateCategoryDto from '../category/dto/createCategory.dto';
import UpdateCategoryDto from '../category/dto/updateCategory.dto';
import { RolesGuard } from '../authentication/guard/role.guard';
import FindOneParams from '../utils/findOneParams';
import { Role } from 'src/authentication/enum/role.enum';
import { Roles } from 'src/authentication/decorators/role.decorator';
import JwtAuthenticationGuard from '../authentication/guard/access-token.guard';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export default class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  getAllCategories() {
    try {
      return this.categoriesService.getAllCategories();
    } catch (e) {
      return {
        message: `Error fetching all categories: ${e.toString()}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      };
    }
  }

  @Get(':id')
  getCategoryById(@Param() { id }: FindOneParams) {
    try {
      return this.categoriesService.getCategoryById(Number(id));
    } catch (e) {
      return {
        message: `Error fetching category: ${e.toString()}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      };
    }
  }

  @Post()
  // @UseGuards(JwtAuthenticationGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  async createCategory(@Body() category: CreateCategoryDto) {
    try {
      const newCategory = await this.categoriesService.createCategory(category);
      return {
        data: newCategory,
        message: "A Category is created successfully",
        status: HttpStatus.CREATED
      };
    } catch (e) {
      return {
        message: `Error creating category: ${e.toString()}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      };
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  async updateCategory(
    @Param() { id }: FindOneParams,
    @Body() category: UpdateCategoryDto,
  ) {
    try {
      const updatedCategory = await this.categoriesService.updateCategory(Number(id), category);
      return {
        data: updatedCategory,
        message: "A Category is updated successfully",
        status: HttpStatus.OK
      };
    } catch (e) {
      return {
        message: `Error updating category: ${e.toString()}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      };
    }
  }

  @Delete(':id')
  // @UseGuards(JwtAuthenticationGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  async deleteCategory(@Param() { id }: FindOneParams) {
    try {
      const deletedCategory = await this.categoriesService.deleteCategory(Number(id));
      return {
        message: "A Category is deleted successfully",
        status: HttpStatus.NO_CONTENT
      };
    } catch (e) {
      return {
        message: `Error deleting category: ${e.toString()}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      };
    }
  }
}
