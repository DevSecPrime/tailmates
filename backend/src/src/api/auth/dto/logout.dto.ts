import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LogOutDto {
  @ApiProperty({
    example: 'dbeee84d-9487-44c4-b7c9-6720d17f2b42-dbeee84d-9487-44c4-b7c9-6720d17f2b42',
  })
  @IsString()
  @IsOptional()
  deviceId: string;
}
