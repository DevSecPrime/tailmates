import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AccessTokenModule } from '../access-token/access-token.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule, AccessTokenModule, RefreshTokenModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
