import { Module } from '@nestjs/common';
import CategoriesController from './category.controller';
import CategoriesService from './category.service';
import Category from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}