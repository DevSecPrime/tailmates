import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessToken } from './entities/access-token.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessToken]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('APP_KEY'),
        signOptions: { expiresIn: configService.get('ACCESS_TOKEN_EXPIRES_IN') || '30 days' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],

  controllers: [],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
