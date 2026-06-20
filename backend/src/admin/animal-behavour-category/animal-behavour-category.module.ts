import { Module } from '@nestjs/common';
import { AnimalBehavourCategoryService } from './animal-behavour-category.service';
import { AnimalBehavourCategoryController } from './animal-behavour-category.controller';

@Module({
  controllers: [AnimalBehavourCategoryController],
  providers: [AnimalBehavourCategoryService],
})
export class AnimalBehavourCategoryModule {}
