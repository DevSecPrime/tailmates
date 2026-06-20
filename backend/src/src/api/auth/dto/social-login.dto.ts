import { ApiProperty } from '@nestjs/swagger';
import { ProviderTypes } from 'src/constants/user.constant';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SocialLoginDto {
  @ApiProperty({
    example: ProviderTypes.APPLE,
    enum: ProviderTypes,
  })
  @IsNotEmpty()
  @IsEnum(ProviderTypes)
  providerType: ProviderTypes;

  @ApiProperty({ example: 'eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ...' })
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @ApiProperty({ example: 'johndeo@mailinator.com' })
  email: string;

  @IsOptional()
  @ApiProperty({ example: 'John deo' })
  fullName: string;
}
