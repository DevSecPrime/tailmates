import { BadRequestException, Injectable } from '@nestjs/common';
import { AnimalBehaviourCategory } from './entities/animal-behaviour-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { CreateAnimalBehaviourCategoryDto } from './dto/create-animal-behaviour-category.dto';

@Injectable()
export class AnimalBehaviourCategoryService {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(AnimalBehaviourCategory)
    private readonly animalBehaviourCategoryRepository: Repository<AnimalBehaviourCategory>,
  ) {}

  /**
   * Retrieves an animal behaviour category by its ID.
   * @param abcId The ID of the animal behaviour category to retrieve.
   * @returns A promise resolving to the retrieved animal behaviour category.
   */
  async getAnimalBehaviourCategoryById(abcId: string): Promise<AnimalBehaviourCategory> {
    const checkAnimalBehaviourCategory = await this.animalBehaviourCategoryRepository
      .createQueryBuilder('abc')
      .where('abc.abcId = :abcId', { abcId })
      .getOne();

    if (!checkAnimalBehaviourCategory) {
      throw new BadRequestException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'animal behaviour category' } }),
      );
    }
    return checkAnimalBehaviourCategory;
  }

  /**
   * Creates a new animal behaviour category.
   * @param createAnimalBehaviourCategoryDto The data for creating the animal behaviour category.
   * @param i18n The internationalization context.
   * @returns A promise resolving to the created animal behaviour category.
   */
  async createAnimalBehaviourCategory(
    createAnimalBehaviourCategoryDto: CreateAnimalBehaviourCategoryDto,
    i18n: I18nContext<I18nTranslations>,
  ) {
    const checkAnimalBehaviourCategory = await this.animalBehaviourCategoryRepository
      .createQueryBuilder('abc')
      .where('TRIM(LOWER(abc.title)) = :title', {
        title: createAnimalBehaviourCategoryDto.title?.toLowerCase().trim() || '',
      })
      .getOne();

    if (checkAnimalBehaviourCategory) {
      throw new BadRequestException(
        i18n.t('exception.ALREADY_EXISTS', { args: { property: 'animal behaviour category' } }),
      );
    }

    const newAnimalBehaviourCategory = await this.animalBehaviourCategoryRepository.save(
      this.animalBehaviourCategoryRepository.create({ ...createAnimalBehaviourCategoryDto }),
    );

    return await this.getAnimalBehaviourCategoryById(newAnimalBehaviourCategory.abcId);
  }
}
