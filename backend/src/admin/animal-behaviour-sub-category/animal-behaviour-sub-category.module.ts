import { Module } from '@nestjs/common';
import { AnimalBehaviourSubCategoryService } from './animal-behaviour-sub-category.service';
import { AnimalBehaviourSubCategoryController } from './animal-behaviour-sub-category.controller';

@Module({
  controllers: [AnimalBehaviourSubCategoryController],
  providers: [AnimalBehaviourSubCategoryService],
})
export class AnimalBehaviourSubCategoryModule {}
