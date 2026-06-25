import { Module } from '@nestjs/common';
import { AnimalBehaviourCategoryService } from './animal-behaviour-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalBehaviourCategory } from './entities/animal-behaviour-category.entity';
import { AnimalBehaviourCategoryController } from 'src/admin/animal-behavour-category/animal-behavour-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnimalBehaviourCategory])],
  controllers: [AnimalBehaviourCategoryController],
  providers: [AnimalBehaviourCategoryService],
  exports: [AnimalBehaviourCategoryService],
})
export class AnimalBehaviourCategoryModule {}
