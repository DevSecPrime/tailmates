import { PartialType } from '@nestjs/swagger';
import { CreateAnimalBehaviourSubCategoryDto } from './create-animal-behaviour-sub-category.dto';

export class UpdateAnimalBehaviourSubCategoryDto extends PartialType(
  CreateAnimalBehaviourSubCategoryDto,
) {}
