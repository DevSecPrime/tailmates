import { Injectable } from '@nestjs/common';

@Injectable()
export class AnimalBehaviourSubCategoryService {
  create() {
    return 'This action adds a new animalBehaviourSubCategory';
  }

  findAll() {
    return 'This action returns all animalBehaviourSubCategory';
  }

  findOne(id: number) {
    return `This action returns a #${id} animalBehaviourSubCategory`;
  }

  update(id: number) {
    return `This action updates a #${id} animalBehaviourSubCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} animalBehaviourSubCategory`;
  }
}
