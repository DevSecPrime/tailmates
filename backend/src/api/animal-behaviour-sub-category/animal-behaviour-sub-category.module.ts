import { Module } from '@nestjs/common';
import { AnimalBehaviourSubCategoryService } from './animal-behaviour-sub-category.service';

@Module({
  controllers: [],
  providers: [AnimalBehaviourSubCategoryService],
})
export class AnimalBehaviourSubCategoryModule {}
