import { Module } from '@nestjs/common';
import { AnimalBehaviourSubCategoryService } from './animal-behaviour-sub-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalBehaviourSubCategory } from './entities/animal-behaviour-sub-category.entity';
import { AnimalBehaviourCategory } from '../animal-behaviour-category/entities/animal-behaviour-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnimalBehaviourSubCategory, AnimalBehaviourCategory])],

  providers: [AnimalBehaviourSubCategoryService],
  exports: [AnimalBehaviourSubCategoryService],
})
export class AnimalBehaviourSubCategoryModule {}
