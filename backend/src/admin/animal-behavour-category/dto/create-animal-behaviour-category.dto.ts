import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n'; // Replace with your specific i18n package if different

export class CreateAnimalBehaviourCategoryDto {
  @ApiProperty({
    description: 'The title of the animal behaviour category',
    example: 'Aggressive Behaviour',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty', { property: 'title' }) })
  @IsString({ message: i18nValidationMessage('validation.isString', { property: 'title' }) })
  title: string;

  @ApiProperty({
    description: 'The description of the animal behaviour category',
    example: 'Behaviors that are aggressive in nature',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty', { property: 'description' }),
  })
  @IsString({
    message: i18nValidationMessage('validation.isString', { property: 'description' }),
  })
  description: string;

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
