import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalBehaviourCategory } from 'src/api/animal-behaviour-category/entities/animal-behaviour-category.entity';
import { AnimalBehaviourCategoryController } from './animal-behaviour-category.controller';
import { AnimalBehaviourCategoryService } from './animal-behaviour-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnimalBehaviourCategory])],
  controllers: [AnimalBehaviourCategoryController],
  providers: [AnimalBehaviourCategoryService],
  exports: [AnimalBehaviourCategoryService],
})
export class AnimalBehaviourCategoryModule {}
