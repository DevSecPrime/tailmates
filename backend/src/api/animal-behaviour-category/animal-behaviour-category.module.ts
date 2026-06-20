import { Module } from '@nestjs/common';
import { AnimalBehaviourCategoryService } from './animal-behaviour-category.service';
import { AnimalBehaviourCategoryController } from './animal-behaviour-category.controller';

@Module({
  controllers: [AnimalBehaviourCategoryController],
  providers: [AnimalBehaviourCategoryService],
})
export class AnimalBehaviourCategoryModule {}
