import { Controller } from '@nestjs/common';
import { AnimalBehaviourCategoryService } from './animal-behaviour-category.service';

@Controller('animal-behaviour-category')
export class AnimalBehaviourCategoryController {
  constructor(private readonly animalBehaviourCategoryService: AnimalBehaviourCategoryService) {}
}
