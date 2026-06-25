import { Module } from '@nestjs/common';
import { AnimalBehaviourSubCategoryService } from './animal-behaviour-sub-category.service';
import { AnimalBehaviourSubCategoryController } from './animal-behaviour-sub-category.controller';
import { AnimalBehaviourSubCategory } from 'src/api/animal-behaviour-sub-category/entities/animal-behaviour-sub-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalBehaviourCategory } from 'src/api/animal-behaviour-category/entities/animal-behaviour-category.entity';
import { AnimalBehaviourCategoryModule } from '../animal-behavour-category/animal-behavour-category.module';

@Module({
  // Import the entity for TypeORM
  imports: [
    TypeOrmModule.forFeature([AnimalBehaviourSubCategory, AnimalBehaviourCategory]),
    AnimalBehaviourCategoryModule,
  ],
  controllers: [AnimalBehaviourSubCategoryController],
  providers: [AnimalBehaviourSubCategoryService],
  exports: [AnimalBehaviourSubCategoryService],
  // Export the service to make it available for injection in other modules
})
export class AnimalBehaviourSubCategoryModule {}
