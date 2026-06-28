import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateAnimalBehaviourSubCategoryTitleDto {
  @ApiProperty({
    description: 'An array of animal behaviour sub-category titles',
    example: ['Sub Category Title', 'Another Sub Category Title', 'Curious Nature'],
    required: false,
    type: [String], // Tells Swagger it's an array of strings
  })
  @IsOptional() // The whole 'title' field can be omitted by the client
  @IsArray() // Ensures the input is an array
  @IsString({ each: true }) // Ensures every item inside the array is a string
  title?: string[];
}

export class CreateAnimalBehaviourSubCategoryDto {
  @ApiProperty({
    description: 'An array of animal behaviour sub-category titles',
    example: ['Sub Category Title', 'Another Sub Category Title', 'Curious Nature'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true }) // Validates that every array element is a string
  title: string[];
}
