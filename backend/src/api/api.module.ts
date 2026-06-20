import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { AppVersionModule } from './app-version/app-version.module';

@Module({
  imports: [AppVersionModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
