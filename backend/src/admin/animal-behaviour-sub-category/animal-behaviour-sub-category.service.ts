import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnimalBehaviourCategory } from 'src/api/animal-behaviour-category/entities/animal-behaviour-category.entity';
import { AnimalBehaviourSubCategory } from 'src/api/animal-behaviour-sub-category/entities/animal-behaviour-sub-category.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateAnimalBehaviourSubCategoryDto } from './dto/create-animal-behaviour-sub-category.dto';
import { UpdateAnimalBehaviourSubCategoryDto } from './dto/update-animal-behaviour-sub-category.dto';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nContext } from 'nestjs-i18n';
import { AnimalBehaviourCategoryService } from '../animal-behaviour-category/animal-behaviour-category.service';
import { createSlug } from 'src/helpers/utils.helper';

@Injectable()
export class AnimalBehaviourSubCategoryService {
  constructor(
    private readonly animalBehaviourCategoryService: AnimalBehaviourCategoryService,

    @InjectRepository(AnimalBehaviourSubCategory)
    private readonly animalBehaviourSubCategoryRepository: Repository<AnimalBehaviourSubCategory>,

    @InjectRepository(AnimalBehaviourCategory)
    private readonly animalBehaviourCategoryRepository: Repository<AnimalBehaviourCategory>,

    private readonly dataSource: DataSource,
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

  /**
   * Updates animal behaviour subcategories under a specific category.
   * Runs inside a database transaction to ensure atomicity.
   */
  async updateSubCategory(
    behaviourCategoryId: string,
    updateAnimalBehaviourSubCategoryDto: UpdateAnimalBehaviourSubCategoryDto,
  ): Promise<AnimalBehaviourCategory> {
    await this.dataSource.transaction(async manager => {
      // 1. Validate parent category
      const behaviourCategory = await manager.findOne(AnimalBehaviourCategory, {
        where: { abcId: behaviourCategoryId },
      });
      if (!behaviourCategory) {
        throw new NotFoundException('Animal behaviour category not found.');
      }

      const deleteIds = updateAnimalBehaviourSubCategoryDto.deleteSubcategoryIds || [];
      const subCategoriesDto = updateAnimalBehaviourSubCategoryDto.subCategories || [];

      // 2. Fetch all requested subcategories globally to validate existence, soft-delete status, and category assignment
      const updateIds = subCategoriesDto
        .map(item => item.subCategoryId)
        .filter((id): id is string => !!id);
      const allRequestedIds = [...new Set([...updateIds, ...deleteIds])];

      const foundSubCategories =
        allRequestedIds.length > 0
          ? await manager.find(AnimalBehaviourSubCategory, {
              where: { absId: In(allRequestedIds) },
              relations: { category: true },
            })
          : [];

      const subCategoryMap = new Map<string, AnimalBehaviourSubCategory>();
      for (const subCat of foundSubCategories) {
        subCategoryMap.set(subCat.absId, subCat);
      }

      for (const id of allRequestedIds) {
        const subCat = subCategoryMap.get(id);
        if (!subCat || subCat.category?.abcId !== behaviourCategoryId) {
          throw new NotFoundException(
            'Subcategory does not belong to the specified behaviour category.',
          );
        }
      }

      // 3. Duplicate checks: Find all currently active subcategories under this category
      const dbActiveSubCategories = await manager.find(AnimalBehaviourSubCategory, {
        where: { category: { id: behaviourCategory.id } },
      });

      const finalActiveTitles = new Set<string>();

      // Parse updates and creates
      const updates: Array<{ subCat: AnimalBehaviourSubCategory; newTitle: string }> = [];
      const creates: Array<{ title: string }> = [];

      for (const item of subCategoriesDto) {
        if (item.subCategoryId) {
          const subCat = subCategoryMap.get(item.subCategoryId);
          if (!subCat) {
            throw new NotFoundException(
              'Subcategory does not belong to the specified behaviour category.',
            );
          }
          const newTitle =
            item.title !== undefined ? item.title.trim() : (subCat.title || '').trim();
          updates.push({ subCat, newTitle });
        } else {
          if (item.title === undefined || item.title.trim() === '') {
            throw new BadRequestException('Subcategory title is required.');
          }
          creates.push({ title: item.title.trim() });
        }
      }

      // Add remaining active subcategories to finalActiveTitles
      for (const subCat of dbActiveSubCategories) {
        const isDeleted = deleteIds.includes(subCat.absId);
        const isUpdated = subCategoriesDto.some(item => item.subCategoryId === subCat.absId);
        if (!isDeleted && !isUpdated) {
          finalActiveTitles.add((subCat.title || '').trim().toLowerCase());
        }
      }

      // Add and check updates
      for (const updateItem of updates) {
        const titleKey = updateItem.newTitle.toLowerCase();
        if (finalActiveTitles.has(titleKey)) {
          throw new ConflictException('Subcategory title already exists.');
        }
        finalActiveTitles.add(titleKey);
      }

      // Add and check creates
      for (const createItem of creates) {
        const titleKey = createItem.title.toLowerCase();
        if (finalActiveTitles.has(titleKey)) {
          throw new ConflictException('Subcategory title already exists.');
        }
        finalActiveTitles.add(titleKey);
      }

      // 4. Perform database operations
      // Perform soft deletes
      if (deleteIds.length > 0) {
        const dbIdsToDelete = deleteIds.map(id => subCategoryMap.get(id)!.id);
        await manager.softDelete(AnimalBehaviourSubCategory, dbIdsToDelete);
      }

      // Perform updates
      for (const updateItem of updates) {
        updateItem.subCat.title = updateItem.newTitle;
        updateItem.subCat.slug = createSlug(updateItem.newTitle);
        await manager.save(updateItem.subCat);
      }

      // Perform creates
      for (const createItem of creates) {
        const newSubCat = manager.create(AnimalBehaviourSubCategory, {
          title: createItem.title,
          slug: createSlug(createItem.title),
          category: behaviourCategory,
        });
        await manager.save(newSubCat);
      }
    });

    // 5. Return the updated category with its active subcategories
    return await this.animalBehaviourCategoryService.getAnimalBehaviourCategoryById(
      behaviourCategoryId,
    );
  }
}
