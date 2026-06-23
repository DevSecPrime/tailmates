import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

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
    description: 'The UUID of the parent behaviour category',
    example: '0810cbc0-2f01-4228-9d8f-e7d09c40c984',
  })
  @IsUUID() // No need for @IsString() as @IsUUID() already validates it's a string format
  behaviourCategoryId: string;

  @ApiProperty({
    description: 'An array of animal behaviour sub-category titles',
    example: ['Sub Category Title', 'Another Sub Category Title', 'Curious Nature'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true }) // Validates that every array element is a string
  title: string[];
}
