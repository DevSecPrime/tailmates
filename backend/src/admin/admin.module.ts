import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AccessTokenModule } from 'src/api/access-token/access-token.module';
import { RefreshTokenModule } from 'src/api/refresh-token/refresh-token.module';
import { User } from 'src/api/user/entities/user.entity';
import { AnimalBehavourCategoryModule } from './animal-behavour-category/animal-behavour-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule, AccessTokenModule, RefreshTokenModule, AnimalBehavourCategoryModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
