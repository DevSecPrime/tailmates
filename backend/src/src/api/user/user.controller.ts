import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/constants/user.constant';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { User } from './entities/user.entity';

import { plainToInstance } from 'class-transformer';
import { I18nTranslations } from 'src/generated/i18n.generated';
import {
  BAD_REQUEST_RESPONSE,
  DELETE_ACCOUNT_REASONS_RESPONSE,
  UNAUTHORIZE_RESPONSE,
  USER_RESPONSE,
} from 'src/constants/swagger.constant';
import { DeleteAccountDto } from './dto/delete-account.dto';

@ApiTags('User')
@Controller('api/v1/user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@AppHeaders()
@UsePipes(ValidationPipe)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get profile
   * @param authUser
   * @param i18n
   * @returns
   */
  @Get('')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @ApiResponse(USER_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.USER)
  async getProfile(@AuthUser() authUser: User, @I18n() i18n: I18nContext<I18nTranslations>) {
    const user = await this.userService.getUserDetails(authUser.uid);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.SUCCESS'),
      data: plainToInstance(User, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  /**
   *
   * @param authUser
   * @param deleteAccountDto
   * @param i18n
   * @returns
   */
  @Delete()
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse(DELETE_ACCOUNT_REASONS_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.USER)
  async deleteAccount(
    @AuthUser() authUser: User,
    @Body() deleteAccountDto: DeleteAccountDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    await this.userService.deleteAccount(authUser, deleteAccountDto);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.PROFILE_DELETED'),
    };
  }
}
