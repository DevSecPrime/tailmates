import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { plainToInstance } from 'class-transformer';
import { User } from '../user/entities/user.entity';
import { VerifyVerificationCodeDto } from './dto/verify-verification-code.dto';
import { UNAUTHORIZE_RESPONSE, USER_LOGIN_RESPONSE } from 'src/constants/swagger.constant';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/constants/user.constant';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { LogOutDto } from './dto/logout.dto';
import { SocialLoginDto } from './dto/social-login.dto';

@ApiTags('Auth')
@Controller('api/v1/auth')
@UsePipes(ValidationPipe)
@AppHeaders()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Send verification code (OTP)
   * @param sendVerificationCodeDto
   * @param i18n
   * @returns
   */
  @Post('send-verification-code')
  @ApiOperation({
    summary: 'Send verification code (OTP) to user email',
    description: `
  This endpoint sends a 6-digit verification code (OTP) to the user's registered email address.
  - If the email exists, it updates the verification code.
  - If the email does not exist, it creates a new user record with the provided email.
  - The verification code is valid for 10 minutes.
  - The timezone header is optional but helps record when the OTP was generated relative to the user’s local time.

  Example use case:
  - Used for email verification during registration or password recovery.
  - If you don’t see the verification email, please check your spam/junk folder.
  `,
  })
  @HttpCode(HttpStatus.CREATED)
  async sendVerificationCode(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Headers('timezone') timezone: string,
  ) {
    await this.authService.sendVerificationCode(sendVerificationCodeDto, timezone);
    return {
      statusCode: HttpStatus.CREATED,
      message: i18n.t('translate.CONFIRM_MAIL'),
    };
  }

  /**
   * Verify verification code
   * @param verifyVerificationCodeDto
   * @param i18n
   * @returns
   */
  @Post('verify-verification-code')
  @ApiOperation({
    summary: 'Verify verification code',
    description: `
  This endpoint verifies the verification code sent to the user's email address.
  - The verification code is valid for 10 minutes.
  - The timezone header is optional but helps record when the OTP was generated relative to the user’s local time.
  `,
  })
  @HttpCode(HttpStatus.OK)
  async verifyVerificationCode(
    @Body() verifyVerificationCodeDto: VerifyVerificationCodeDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const user = await this.authService.verifyVerificationCode(verifyVerificationCodeDto);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.OTP_VERIFIED'),
      data: plainToInstance(User, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Social login
   * @param socialLoginDto
   * @param i18n
   * @returns
   */
  @Post('social-login')
  @ApiOperation({ summary: 'Social login' })
  @HttpCode(HttpStatus.OK)
  async socialLogin(
    @Body() socialLoginDto: SocialLoginDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Headers('timezone') timezone: string,
  ) {
    const user = await this.authService.socialLogin(socialLoginDto, timezone, i18n);
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
   * Logout user
   * @param authUser
   * @param i18n
   * @returns
   */
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(USER_LOGIN_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.USER)
  async logout(
    @AuthUser() authUser: User,
    @Body() logOutDto: LogOutDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    await this.authService.logout(authUser, logOutDto);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.LOGGED_OUT'),
    };
  }
}
