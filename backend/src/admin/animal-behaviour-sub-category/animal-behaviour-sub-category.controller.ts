import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AnimalBehaviourSubCategoryService } from './animal-behaviour-sub-category.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { CreateAnimalBehaviourSubCategoryDto } from './dto/create-animal-behaviour-sub-category.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { plainToInstance } from 'class-transformer';
import { AnimalBehaviourCategory } from 'src/api/animal-behaviour-category/entities/animal-behaviour-category.entity';

@ApiTags('Admin - Animal Behaviour Sub Category')
@Controller('admin/animal-behaviour-sub-category')
@UsePipes(ValidationPipe) // Apply validation globally to all routes in this controller
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // Ensure that all routes are protected by JWT authentication
@AppHeaders() // Custom decorator to handle headers, if needed
export class AnimalBehaviourSubCategoryController {
  constructor(
    private readonly animalBehaviourSubCategoryService: AnimalBehaviourSubCategoryService,
  ) {}

  /**
   * Create a new animal behaviour sub-category
   */
  @Post(':behaviourCategoryId')
  @ApiOperation({ summary: 'Create a new animal behaviour sub-category' })
  @ApiParam({
    name: 'behaviourCategoryId',
    description: 'The UUID of the parent behaviour category',
  })
  @ApiBody({ type: CreateAnimalBehaviourSubCategoryDto })
  async createSubCategory(
    @Param('behaviourCategoryId') behaviourCategoryId: string,
    @Body() createAnimalBehaviourSubCategoryDto: CreateAnimalBehaviourSubCategoryDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const result = await this.animalBehaviourSubCategoryService.createSubCategory(
      behaviourCategoryId,
      createAnimalBehaviourSubCategoryDto,
      i18n,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: i18n.t('translate.CREATED', { args: { property: 'Animal Behaviour Sub Category' } }),
      data: plainToInstance(AnimalBehaviourCategory, result, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }), // Transform the result to an instance of AnimalBehaviourCategory
    };
  }
}
