import { Controller } from '@nestjs/common';
import { AnimalBehavourCategoryService } from './animal-behavour-category.service';

@Controller('animal-behavour-category')
export class AnimalBehavourCategoryController {
  constructor(private readonly animalBehavourCategoryService: AnimalBehavourCategoryService) {}
}
