import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { AppVersionsStatus } from 'src/constants/app.constant';
import { Repository } from 'typeorm';
import { CheckAppVersionDto } from './dto/check-app-version';
import { AppVersion } from './entities/app-version.entity';

@Injectable()
export class AppVersionService {
  constructor(
    @InjectRepository(AppVersion)
    private readonly appVersionRepository: Repository<AppVersion>,
    private readonly i18n: I18nService,
  ) {}

  async checkAppVersion({ platform, version }: CheckAppVersionDto) {
    const appVersion = await this.appVersionRepository
      .createQueryBuilder('apv')
      .where('apv.platform = :platform', { platform })
      .getOne();

    if (!appVersion) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', {
          args: { property: 'app version' },
        }),
      );
    }

    const { minVersion, latestVersion, link } = appVersion;

    if (version < minVersion) {
      return {
        message: this.i18n.t('translate.OUTDATED_APP'),
        data: { status: AppVersionsStatus.OUTDATED, link },
      };
    }

    if (version < latestVersion) {
      return {
        message: this.i18n.t('translate.UPDATE_APP'),
        data: { status: AppVersionsStatus.OPTIONAL, link },
      };
    }
    return {
      message: this.i18n.t('translate.UP_TO_DATE_APP'),
      data: { status: AppVersionsStatus.UP_TO_DATE, link },
    };
  }
}
