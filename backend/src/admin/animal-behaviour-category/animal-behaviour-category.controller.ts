import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserRoles } from 'src/constants/user.constant';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateAnimalBehaviourCategoryDto } from './dto/create-animal-behaviour-category.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { AnimalBehaviourCategory } from 'src/api/animal-behaviour-category/entities/animal-behaviour-category.entity';
import { AnimalBehaviourCategoryService } from './animal-behaviour-category.service';
import { UpdateAnimalBehaviourCategoryDto } from './dto/update-animal-behaviour-category.dto';
import { DEFAULT_COUNT, DEFAULT_LIMIT } from 'src/constants/app.constant';

@Controller('admin/animal-behaviour-category')
@ApiTags('Admin Animal Behaviour Category')
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnimalBehaviourCategoryController {
  constructor(private readonly animalBehaviourCategoryService: AnimalBehaviourCategoryService) {}

  /**
   * Creates a new animal behaviour category.
   * @param createAnimalBehaviourCategoryDto -
   * The DTO containing the details of the animal behaviour category to be created.
   */
  @Post()
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createAnimalBehaviourCategory(
    @Body() createAnimalBehaviourCategoryDto: CreateAnimalBehaviourCategoryDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const animalBehaviourCategory =
      await this.animalBehaviourCategoryService.createAnimalBehaviourCategory(
        createAnimalBehaviourCategoryDto,
        i18n,
      );

    return {
      statusCode: HttpStatus.CREATED,
      message: i18n.t('translate.CREATED', { args: { property: 'animal behaviour category' } }),
      data: plainToInstance(AnimalBehaviourCategory, animalBehaviourCategory, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  @Put(':abcId')
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'abcId', description: 'The ID of the animal behaviour category to update' })
  @ApiOperation({ summary: 'Update an animal behaviour category' })
  async updateAnimalBehaviourCategory(
    @Param('abcId', new ParseUUIDPipe({ version: '4' })) abcId: string,
    @Body() updateAnimalBehaviourCategoryDto: UpdateAnimalBehaviourCategoryDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const updatedCategory = await this.animalBehaviourCategoryService.updateAnimalBehaviourCategory(
      abcId,
      updateAnimalBehaviourCategoryDto,
      i18n,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.UPDATED', { args: { property: 'animal behaviour category' } }),
      data: plainToInstance(AnimalBehaviourCategory, updatedCategory, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  /**
   * Get all animal behaviour categories
   */
  @Get(':abcId')
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an animal behaviour category by ID' })
  @ApiParam({ name: 'abcId', description: 'The ID of the animal behaviour category to retrieve' })
  async getAnimalBehaviourCategory(
    @Param('abcId', new ParseUUIDPipe({ version: '4' })) abcId: string,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const category =
      await this.animalBehaviourCategoryService.getAnimalBehaviourCategoryById(abcId);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.RETRIEVED', {
        args: { property: 'animal behaviour category has been' },
      }),
      data: plainToInstance(AnimalBehaviourCategory, category, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  /**
   * Delete an animal behaviour category by ID
   */
  @Delete(':abcId')
  @Roles(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an animal behaviour category by ID' })
  @ApiParam({ name: 'abcId', description: 'The ID of the animal behaviour category to delete' })
  async deleteAnimalBehaviourCategory(
    @Param('abcId', new ParseUUIDPipe({ version: '4' })) abcId: string,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    await this.animalBehaviourCategoryService.deleteAnimalBehaviourCategory(abcId, i18n);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.DELETED', { args: { property: 'animal behaviour category' } }),
    };
  }

  /**
   * Get all animal behaviour categories
   */
  @Get()
  @ApiOperation({ summary: 'Get all animal behaviour categories' })
  @Roles(UserRoles.ADMIN)
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for filtering records',
    type: String,
    example: 'Aggressive',
  })
  @ApiQuery({
    name: 'count',
    required: false,
    description: 'Number of records to return',
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records to return',
    type: Number,
    example: 10,
  })
  async getAllAnimalBehaviourCategories(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('search') search?: string,
    @Query('count') count?: number,
    @Query('limit') limit?: number,
  ) {
    count = Number.isFinite(Number(count)) && Number(count) >= 0 ? Number(count) : DEFAULT_COUNT;
    limit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : DEFAULT_LIMIT;

    const { categories, total } =
      await this.animalBehaviourCategoryService.getAllAnimalBehaviourCategories(
        search,
        count,
        limit,
      );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.RETRIEVED', { args: { property: 'animal behaviour categories' } }),
      data: plainToInstance(AnimalBehaviourCategory, categories, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + categories.length,
      },
    };
  }
}
