import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminLoginDto } from './dto/admin-login.dto';
import { plainToInstance } from 'class-transformer';

import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/constants/user.constant';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Languages } from 'src/constants/app.constant';
import { User } from 'src/api/user/entities/user.entity';

@ApiTags('Admin')
@Controller('api/v1/admin')
@UsePipes(ValidationPipe)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Admin login
   * @param adminLoginDto admin login dto
   * @param i18n
   * @returns
   */
  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  async login(@Body() adminLoginDto: AdminLoginDto, @I18n() i18n: I18nContext<I18nTranslations>) {
    const user = await this.adminService.login(adminLoginDto);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.LOGGED_IN'),
      data: plainToInstance(User, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Dashboard data
   * @param req
   * @param res
   * @returns
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Dashboard data', description: 'Get dashboard data' })
  async dashboard() {
    const data = await this.adminService.dashboardData();

    return { data };
  }

  /**
   * Change admin password
   * @param authUser auth user
   * @param changePasswordDto change password dto
   * @param i18n i18n
   * @returns
   */
  @Post('change-password')
  @ApiOperation({ summary: 'Change admin password' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async changePassword(
    @AuthUser() authUser: User,
    @Body() changePasswordDto: ChangePasswordDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    await this.adminService.changePassword(authUser, changePasswordDto);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.PASSWORD_CHANGED', { lang: Languages.EN }),
    };
  }

  /**
   * Logout admin
   * @param authUser
   * @param i18n
   * @returns
   */
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async logout(@AuthUser() authUser: User, @I18n() i18n: I18nContext<I18nTranslations>) {
    await this.adminService.logout(authUser);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.LOGGED_OUT'),
    };
  }
}
