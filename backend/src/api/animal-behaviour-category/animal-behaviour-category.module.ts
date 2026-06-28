import { Module } from '@nestjs/common';
import { AnimalBehaviourCategoryService } from './animal-behaviour-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalBehaviourCategory } from './entities/animal-behaviour-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnimalBehaviourCategory])],
  providers: [AnimalBehaviourCategoryService],
  exports: [AnimalBehaviourCategoryService],
})
export class AnimalBehaviourCategoryModule {}
