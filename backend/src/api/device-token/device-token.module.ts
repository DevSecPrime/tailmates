import { Module } from '@nestjs/common';
import { DeviceTokenService } from './device-token.service';
import { DeviceTokenController } from './device-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from './entities/device-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceToken])],
  controllers: [DeviceTokenController],
  providers: [DeviceTokenService],
  exports: [DeviceTokenService],
})
export class DeviceTokenModule {}
