import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/constants/app.constant';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
import { UserRoles } from 'src/constants/user.constant';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('Admin User')
@Controller('admin/user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(ValidationPipe)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users
   * @param search
   * @param _page
   * @param _limit
   * @param i18n
   * @returns
   */
  @Get('')
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search with name',
  })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  @Roles(UserRoles.ADMIN)
  async getAllUsers(
    @Query('search') search: string,
    @Query('page') _page: number,
    @Query('limit') _limit: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const page = Number(_page) || DEFAULT_PAGE;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const [users, total] = await this.userService.getAllUsers(search, page, limit);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.RETRIEVED', { args: { property: 'Users' } }),
      data: plainToInstance(User, users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),

      meta: {
        totalItems: Number(total),
        itemsPerPage: limit ? limit : total,
        totalPages: limit ? Math.ceil(total / limit) : 1,
        currentPage: limit ? Number(page) : 1,
      },
    };
  }

  /**
   * Block/Unblock user by admin
   * @param uid
   * @param i18n
   * @returns
   */
  @Patch(':uid')
  @ApiOperation({ summary: 'Block/unblock user by admin' })
  @ApiParam({ name: 'uid', required: true, type: 'string' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async blockUnblockUser(@Param('uid') uid: string, @I18n() i18n: I18nContext<I18nTranslations>) {
    const user = await this.userService.blockUnblockUser(uid);
    const message = i18n.t('translate.USER_BLOCK_TOGGLE_SUCCESS_ADMIN', {
      args: { property: user.isBlocked ? 'blocked' : 'unblocked' },
    });
    return {
      statusCode: HttpStatus.OK,
      message,
      data: plainToInstance(User, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }
}
