import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendVerificationCodeDto {
  @ApiProperty({
    name: 'email',
    description: 'Email of the user',
    example: 'mark.studioera@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
