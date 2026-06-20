import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@studioera.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'oT9(5M{U3q]zani' })
  @IsNotEmpty()
  password: string;
}
