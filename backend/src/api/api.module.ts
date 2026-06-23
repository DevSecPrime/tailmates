import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { AppVersionModule } from './app-version/app-version.module';
import { UserModule } from './user/user.module';
import { AccessTokenModule } from './access-token/access-token.module';

import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { AuthModule } from './auth/auth.module';
import { DeviceTokenModule } from './device-token/device-token.module';

import { AnimalBehaviourCategoryModule } from './animal-behaviour-category/animal-behaviour-category.module';
import { AnimalBehaviourSubCategoryModule } from './animal-behaviour-sub-category/animal-behaviour-sub-category.module';

@Module({
  imports: [
    AppVersionModule,
    UserModule,
    AccessTokenModule,
    RefreshTokenModule,
    AuthModule,
    DeviceTokenModule,
    AnimalBehaviourCategoryModule,
    AnimalBehaviourSubCategoryModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
