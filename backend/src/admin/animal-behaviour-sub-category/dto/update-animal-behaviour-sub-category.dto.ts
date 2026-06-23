import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSubCategoryItemDto {
  @ApiProperty({
    description:
      'The UUID of the subcategory. Pass this to update an existing entry. Omit it to create a new entry.',
    example: 'd3b07384-d113-49cd-a5d6-8ee00d51f23a',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  subCategoryId?: string;

  @ApiProperty({
    description: 'The title of the subcategory',
    example: 'Curious Nature',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;
}

export class UpdateAnimalBehaviourSubCategoryDto {
  @ApiProperty({
    description: 'Array of subcategories to create or update',
    type: [UpdateSubCategoryItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSubCategoryItemDto)
  // Crucial for class-validator to drill down into the array of objects
  subCategories?: UpdateSubCategoryItemDto[];

  @ApiProperty({
    description: 'Array of subcategory UUIDs that should be deleted',
    example: ['e1b07384-d113-49cd-a5d6-8ee00d51f23b', 'f2b07384-d113-49cd-a5d6-8ee00d51f23c'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  deleteSubcategoryIds?: string[];
}
