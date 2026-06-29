import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { CreateAnimalBehaviourCategoryDto } from './dto/create-animal-behaviour-category.dto';
import { AnimalBehaviourCategory } from 'src/api/animal-behaviour-category/entities/animal-behaviour-category.entity';
import { createSlug } from 'src/helpers/utils.helper';
import { UpdateAnimalBehaviourCategoryDto } from './dto/update-animal-behaviour-category.dto';

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
      .leftJoinAndSelect('abc.behaviourSubCategories', 'behaviourSubCategories')
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
      this.animalBehaviourCategoryRepository.create({
        ...createAnimalBehaviourCategoryDto,
        slug: createAnimalBehaviourCategoryDto.title
          ? createSlug(createAnimalBehaviourCategoryDto.title)
          : '',
      }),
    );

    return await this.getAnimalBehaviourCategoryById(newAnimalBehaviourCategory.abcId);
  }

  /**
   * Updates an existing animal behaviour category.
   * @param abcId The ID of the animal behaviour category to update.
   * @param updateAnimalBehaviourCategoryDto The data for updating the animal behaviour category.
   * @param i18n The internationalization context.
   * @returns A promise resolving to the updated animal behaviour category.
   */
  async updateAnimalBehaviourCategory(
    abcId: string, // Change to number if applicable
    updateAnimalBehaviourCategoryDto: UpdateAnimalBehaviourCategoryDto,
    i18n: I18nContext<I18nTranslations>,
  ) {
    // 1. Check if the category to update actually exists
    const existingCategory = await this.animalBehaviourCategoryRepository.findOne({
      where: { abcId },
    });

    if (!existingCategory) {
      throw new NotFoundException(
        i18n.t('exception.NOT_FOUND', { args: { property: 'animal behaviour category' } }),
      );
    }

    // 2. If title is being updated, check if it's already used by ANOTHER category
    let slug: string | undefined = existingCategory.slug ?? null; // Default to existing slug
    if (updateAnimalBehaviourCategoryDto.title) {
      const titleExistsInAnotherCategory = await this.animalBehaviourCategoryRepository
        .createQueryBuilder('abc')
        .where('TRIM(LOWER(abc.title)) = :title', {
          title: updateAnimalBehaviourCategoryDto.title.toLowerCase().trim(),
        })
        .andWhere('abc.abcId != :abcId', { abcId }) // Exclude the current category
        .getOne();

      if (titleExistsInAnotherCategory) {
        throw new BadRequestException(
          i18n.t('exception.ALREADY_EXISTS', {
            args: { property: 'animal behaviour category title' },
          }),
        );
      }
      slug = createSlug(updateAnimalBehaviourCategoryDto.title);
    }

    // 3. Prepare updated data (re-generate slug if the title is provided)
    const updatedData: Partial<AnimalBehaviourCategory> = {
      ...updateAnimalBehaviourCategoryDto,
      slug,
    };

    // 4. Update the category in the database
    await this.animalBehaviourCategoryRepository.update(existingCategory.id, updatedData);

    // 5. Return the fresh updated document
    return await this.getAnimalBehaviourCategoryById(abcId);
  }

  /**
   * Deletes an animal behaviour category by ID.
   * @param abcId The ID of the animal behaviour category to delete.
   * @param i18n The internationalization context.
   * @returns A promise resolving to void.
   */
  async deleteAnimalBehaviourCategory(
    abcId: string,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<void> {
    const existingCategory = await this.animalBehaviourCategoryRepository.findOne({
      where: { abcId },
    });

    if (!existingCategory) {
      throw new NotFoundException(
        i18n.t('exception.NOT_FOUND', { args: { property: 'animal behaviour category' } }),
      );
    }

    //Check if its sub categories are used or not
    //Check if category has any categories delete it first
    await this.animalBehaviourCategoryRepository.softDelete({ id: existingCategory.id });
  }

  /**
   * Gets all animal behaviour categories with optional search and pagination.
   * @param search The search term for filtering categories.
   * @param count The number of items to skip.
   * @param limit The maximum number of items to retrieve.
   * @returns A promise resolving to the list of animal behaviour categories and the total count.
   */
  async getAllAnimalBehaviourCategories(search: string, count: number, limit: number) {
    // Implementation for fetching all animal behaviour categories
    const queryBuilder = this.animalBehaviourCategoryRepository.createQueryBuilder('abc');

    if (search && search.trim() !== '' && search !== 'undefined') {
      queryBuilder.where('abc.title ILIKE :search OR abc.description ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [categories, total] = await queryBuilder.skip(count).take(limit).getManyAndCount();
    return { categories, total };
  }
}
