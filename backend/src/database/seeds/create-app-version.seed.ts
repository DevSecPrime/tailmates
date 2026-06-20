import type { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';
import { AppVersion } from 'src/api/app-version/entities/app-version.entity';
import { DeviceTypes } from 'src/constants/app.constant';

export default class CreateAppVersionSeeder implements Seeder {
  /**
   * Track seeder execution.
   *
   * Default: false
   */
  track = false;
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query(
      'TRUNCATE TABLE app_versions RESTART IDENTITY CASCADE;',
    );
    const repository = dataSource.getRepository(AppVersion);
    await repository
      .insert([
        {
          id: 1,
          minVersion: 1,
          latestVersion: 1,
          link: 'https://ios.apple.com/join/h86sugHG',
          platform: DeviceTypes.IOS,
        },
        {
          id: 2,
          minVersion: 2,
          latestVersion: 2,
          link: 'https://play.google.com/store/apps/details?id=com.app.mobile.app&pcampaignid=web_share',
          platform: DeviceTypes.ANDROID,
        },
      ])
      .then(() => {
        console.warn(
          'Database seeding: Application version data inserted successfully.',
        );
      })
      .catch((error) => {
        console.warn(
          'Database seeding: Application version data insertion failed.',
        );
        console.warn(error);
      });
  }
}
