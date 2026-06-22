import { Module } from '@nestjs/common';
import { AnimalBehaviourCategoryService } from './animal-behaviour-category.service';
import { AnimalBehaviourCategoryController } from './animal-behaviour-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalBehaviourCategory } from './entities/animal-behaviour-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnimalBehaviourCategory])],
  controllers: [AnimalBehaviourCategoryController],
  providers: [AnimalBehaviourCategoryService],
  exports: [AnimalBehaviourCategoryService],
})
export class AnimalBehaviourCategoryModule {}
