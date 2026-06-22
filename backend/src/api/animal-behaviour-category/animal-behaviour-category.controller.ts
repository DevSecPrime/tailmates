import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AnimalBehaviourCategoryService } from './animal-behaviour-category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRoles } from 'src/constants/user.constant';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateAnimalBehaviourCategoryDto } from './dto/create-animal-behaviour-category.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { AnimalBehaviourCategory } from './entities/animal-behaviour-category.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';

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
}
