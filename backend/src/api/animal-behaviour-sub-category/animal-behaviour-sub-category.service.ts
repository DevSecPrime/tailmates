import { Injectable } from '@nestjs/common';
import { CreateAnimalBehaviourSubCategoryDto } from './dto/create-animal-behaviour-sub-category.dto';
import { UpdateAnimalBehaviourSubCategoryDto } from './dto/update-animal-behaviour-sub-category.dto';

@Injectable()
export class AnimalBehaviourSubCategoryService {
  create(createAnimalBehaviourSubCategoryDto: CreateAnimalBehaviourSubCategoryDto) {
    return 'This action adds a new animalBehaviourSubCategory';
  }

  findAll() {
    return `This action returns all animalBehaviourSubCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} animalBehaviourSubCategory`;
  }

  update(id: number, updateAnimalBehaviourSubCategoryDto: UpdateAnimalBehaviourSubCategoryDto) {
    return `This action updates a #${id} animalBehaviourSubCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} animalBehaviourSubCategory`;
  }
}
