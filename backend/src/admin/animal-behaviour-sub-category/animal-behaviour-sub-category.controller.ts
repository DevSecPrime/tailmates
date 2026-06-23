import { Controller } from '@nestjs/common';
import { AnimalBehaviourSubCategoryService } from './animal-behaviour-sub-category.service';

@Controller('animal-behaviour-sub-category')
export class AnimalBehaviourSubCategoryController {
  constructor(private readonly animalBehaviourSubCategoryService: AnimalBehaviourSubCategoryService) {}
}
