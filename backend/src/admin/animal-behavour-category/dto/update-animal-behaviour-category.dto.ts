import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateAnimalBehaviourCategoryDto {
  @ApiProperty({
    description: 'The title of the animal behaviour category',
    example: 'Aggressive Behaviour',
    required: false, // Swagger will show this as optional
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString', { property: 'title' }) })
  title?: string;

  @ApiProperty({
    description: 'The description of the animal behaviour category',
    example: 'Behaviors that are aggressive in nature',
    required: false, // Swagger will show this as optional
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.isString', { property: 'description' }),
  })
  description?: string;

  @ApiProperty({
    description: 'Indicates whether the animal behaviour category is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('validation.isBoolean', { property: 'isActive' }),
  })
  isActive?: boolean;
}
