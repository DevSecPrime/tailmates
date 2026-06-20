import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty({
    example: 'I’m concerned about my data/privacy',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
