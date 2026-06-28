import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnimalBehaviourCategory } from 'src/api/animal-behaviour-category/entities/animal-behaviour-category.entity';
import { AnimalBehaviourSubCategory } from 'src/api/animal-behaviour-sub-category/entities/animal-behaviour-sub-category.entity';
import { In, Repository } from 'typeorm';
import { CreateAnimalBehaviourSubCategoryDto } from './dto/create-animal-behaviour-sub-category.dto';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nContext } from 'nestjs-i18n';
import { AnimalBehaviourCategoryService } from '../animal-behavour-category/animal-behavour-category.service';
import { createSlug } from 'src/helpers/utils.helper';

@Injectable()
export class AnimalBehaviourSubCategoryService {
  constructor(
    private readonly animalBehaviourCategoryService: AnimalBehaviourCategoryService,

    @InjectRepository(AnimalBehaviourSubCategory)
    private readonly animalBehaviourSubCategoryRepository: Repository<AnimalBehaviourSubCategory>,

    @InjectRepository(AnimalBehaviourCategory)
    private readonly animalBehaviourCategoryRepository: Repository<AnimalBehaviourCategory>,
  ) {}

  /**
   * Creates a new subcategory for the specified behavior category.
   * @param behaviourCategoryId The ID of the behavior category to associate the subcategory with.
   * @param createAnimalBehaviourSubCategoryDto The data for creating the subcategory.
   * @param i18n The internationalization context.
   * @returns A promise resolving to the created subcategory.
   */
  async createSubCategory(
    behaviourCategoryId: string,
    createAnimalBehaviourSubCategoryDto: CreateAnimalBehaviourSubCategoryDto,
    i18n: I18nContext<I18nTranslations>,
  ) {
    // 1. Verify that the parent category exists
    const behaviourCategory =
      await this.animalBehaviourCategoryService.getAnimalBehaviourCategoryById(behaviourCategoryId);
    if (!behaviourCategory) {
      throw new BadRequestException(
        i18n.t('exception.NOT_FOUND', { args: { property: 'behaviour category' } }),
      );
    }

    // 2. Remove duplicate titles sent within the request body itself
    const uniqueIncomingTitles = [...new Set(createAnimalBehaviourSubCategoryDto.title)];

    if (uniqueIncomingTitles.length === 0) {
      throw new BadRequestException(
        i18n.t('exception.ALREADY_EXISTS', { args: { property: 'sub-category title' } }),
      );
    }

    // 3. Optimized DB Check: Fetch any existing sub-categories matching these titles in one query
    // Adjust the repository call below based on your ORM (Prisma/TypeORM/Mongoose)
    const existingSubCategories = await this.animalBehaviourSubCategoryRepository.find({
      where: {
        category: { id: behaviourCategory.id },
        title: In(uniqueIncomingTitles), // Using TypeORM 'In' operator as an example
      },
    });

    // 4. Identify which titles already exist in the database
    const existingTitles = existingSubCategories.map(subCat => subCat.title);

    if (existingTitles.length > 0) {
      throw new BadRequestException(
        i18n.t('exception.ALREADY_EXISTS', { args: { property: `${existingTitles.join(', ')}` } }),
      );
    }

    // 5. Bulk insert the new sub-categories (No loops executing queries!)
    const subCategoriesToCreate = await Promise.all(
      uniqueIncomingTitles.map(async title => ({
        category: { id: behaviourCategory.id },
        title,
        slug: title ? createSlug(title) : null,
      })),
    );

    await this.animalBehaviourSubCategoryRepository.save(subCategoriesToCreate);

    return await this.animalBehaviourCategoryService.getAnimalBehaviourCategoryById(
      behaviourCategoryId,
    );
  }
}
