import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenModule } from '../access-token/access-token.module';
import { UserModule } from '../user/user.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { JwtStrategy } from 'src/passport/jwt.strategy';
import { DeviceToken } from '../device-token/entities/device-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DeviceToken]),
    AccessTokenModule,
    UserModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
