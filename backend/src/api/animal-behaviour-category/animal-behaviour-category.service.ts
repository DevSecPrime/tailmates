import { Injectable } from '@nestjs/common';
import { AnimalBehaviourCategory } from './entities/animal-behaviour-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';

import { Repository } from 'typeorm';

@Injectable()
export class AnimalBehaviourCategoryService {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(AnimalBehaviourCategory)
    private readonly animalBehaviourCategoryRepository: Repository<AnimalBehaviourCategory>,
  ) {}
}
