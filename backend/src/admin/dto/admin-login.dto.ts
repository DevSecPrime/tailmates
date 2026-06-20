import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@tailmates.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Y1!S813$6k3D9J)c' })
  @IsNotEmpty()
  password: string;
}
