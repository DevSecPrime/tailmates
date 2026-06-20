import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppVersionService } from './app-version.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { CHECK_APP_VERSION_RESPONSE } from 'src/constants/swagger.constant';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { CheckAppVersionDto } from './dto/check-app-version';

@ApiTags('App Tags')
@Controller('api/v1/app-version')
@UsePipes(ValidationPipe)
@AppHeaders()
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  /**
   *
   */
  @Post('check-app-version')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Check app version',
    description: `this endpoint is used to check the app version
    platform : iOS, Android
    status =
    0: Up to date, 
    1: Force Update, 
    2: Recommended Update (Optional Update)
    `,
  })
  @ApiResponse(CHECK_APP_VERSION_RESPONSE)
  async checkAppVersion(
    @Body() checkAppVersionDto: CheckAppVersionDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const data =
      await this.appVersionService.checkAppVersion(checkAppVersionDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: i18n.t('translate.SUCCESS'),
      ...data,
    };
  }
}
