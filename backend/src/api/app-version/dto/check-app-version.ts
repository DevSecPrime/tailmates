import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { DeviceTypes } from 'src/constants/app.constant';

export class CheckAppVersionDto {
  @ApiProperty({
    name: 'platform',
    description: 'Platform of the app',
    example: DeviceTypes.IOS,
    enum: Object.assign(DeviceTypes),
    required: true,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.IS_NOT_EMPTY'),
  })
  @IsEnum(DeviceTypes)
  platform: DeviceTypes;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty', {
      property: 'version',
    }),
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  version: number;
}
