import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class VerifyVerificationCodeDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'mark.studioera@gmail.com', required: true })
  email: string;

  @ApiProperty({ example: '090900' })
  @IsNotEmpty()
  @Length(6, 6, { message: 'Verification code must be 6 digits' })
  verificationCode: string;
}
