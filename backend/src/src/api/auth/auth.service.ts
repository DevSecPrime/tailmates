import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AccessTokenService } from '../access-token/access-token.service';
import { Repository } from 'typeorm';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { randomInt } from 'crypto';
import moment from 'moment';
import { UserService } from '../user/user.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyVerificationCodeDto } from './dto/verify-verification-code.dto';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { DeviceToken } from '../device-token/entities/device-token.entity';
import { LogOutDto } from './dto/logout.dto';
import SocialiteGoogle from 'src/socialite/google.socialite';
import { ProviderTypes } from 'src/constants/user.constant';
import { SocialiteApple } from 'src/socialite/apple.socialite';
import { SocialLoginDto } from './dto/social-login.dto';
import { Languages } from 'src/constants/app.constant';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Injectable()
export class AuthService {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userService: UserService,
    private readonly i18n: I18nService,
    private readonly mailerService: MailerService,
    @InjectRepository(DeviceToken)
    private readonly deviceTokenRepository: Repository<DeviceToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Send Verification code to user
   * @param user object
   */
  async sendVerifyAccountMail(user: User) {
    /* send verification code mail */
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: this.i18n.t('email.VERIFICATION_MAIL_SUBJECT'),
        template: 'verify-email/en', //`verify-email/${i18n.lang}`,
        context: { verificationCode: user.verificationCode },
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  /**
   * Generate tokens
   * @param user
   * @returns
   */
  async generateTokens(user: User) {
    const { decodedToken, jwtToken } = await this.accessTokenService.createToken(user);
    const refreshToken = await this.refreshTokenService.createToken(
      decodedToken as { iat: number; exp: number; jti: string },
    );
    return {
      accessToken: jwtToken,
      refreshToken,
      expiresAt: decodedToken['exp'],
    };
  }
  /**
   * Send verification code to user
   * @param sendVerificationCodeDto
   * @param timezone
   * @returns
   */
  async sendVerificationCode(
    sendVerificationCodeDto: SendVerificationCodeDto,
    timezone: string,
  ): Promise<void> {
    const email = sendVerificationCodeDto.email.trim().toLowerCase();

    // Predefined emails for testing (always get 000000)
    const verifiedEmails = [
      'aryan.uniqual@gmail.com',
      'mark.studioera@gmail.com',
      'priyesh.uniqual@gmail.com',
    ];

    // Fetch user once
    const existingUser = await this.userService.getUserByEmail(email);

    // 🔐 Generate OTP (secure + deterministic for whitelisted emails)
    const verificationCode = verifiedEmails.includes(email)
      ? '000000'
      : randomInt(100000, 999999).toString();

    const verificationCodeExpiresAt = moment().add(10, 'minutes').toDate();

    // Payload for user creation or update
    const payload = {
      email,
      verificationCode,
      verificationCodeExpiresAt,
      timezone,
    };

    // ⚠️ Validate existing user
    if (existingUser) {
      if (existingUser.isBlocked) {
        throw new BadRequestException(this.i18n.t('exception.USER_BLOCKED_BY_ADMIN'));
      }

      if (existingUser.isSocialLoggedIn) {
        throw new ConflictException(
          this.i18n.t('exception.EMAIL_ASSOCIATED_WITH_SOCIAL_PLATFORM', {
            args: { property: existingUser.providerType },
          }),
        );
      }
    }

    // ✅ Create or update user
    const user = await this.userService.createOrUpdate(payload, existingUser?.id ?? null);

    // ✉️ Send verification email
    if (!verifiedEmails.includes(email)) {
      await this.sendVerifyAccountMail(user);
    }
  }

  /**
   * Verify verification code
   * @param verifyVerificationCodeDto
   * @returns
   */
  async verifyVerificationCode(
    verifyVerificationCodeDto: VerifyVerificationCodeDto,
  ): Promise<User> {
    const { email, verificationCode } = verifyVerificationCodeDto;
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'user' } }),
      );
    }

    if (user.verificationCode !== verificationCode) {
      throw new BadRequestException(this.i18n.t('exception.INVALID_OTP'));
    }

    if (moment().isAfter(user.verificationCodeExpiresAt)) {
      throw new BadRequestException(this.i18n.t('exception.OTP_EXPIRED'));
    }

    const data = {
      verificationCode: null,
      verificationCodeExpiresAt: null,
      verifiedAt: moment().toDate(),
    };

    const verifiedUser = await this.userService.createOrUpdate(data, user.id);
    const authentication = await this.generateTokens(verifiedUser);
    return { ...verifiedUser, authentication };
  }

  /**
   * Social login
   * @param socialLoginDto
   * @param timezone
   * @param i18n
   * @returns
   */
  async socialLogin(
    socialLoginDto: SocialLoginDto,
    timezone: string,
    i18n: I18nContext<I18nTranslations>,
  ) {
    let socialUser;
    /* Identify social provider and fetch user */
    switch (socialLoginDto.providerType) {
      case ProviderTypes.GOOGLE:
        socialUser = await new SocialiteGoogle().generateUserFromToken(socialLoginDto.token);
        break;
      case ProviderTypes.APPLE:
        socialUser = await new SocialiteApple(this.userRepository).generateUserFromToken(
          socialLoginDto.token,
        );
        break;
      default:
        throw new BadRequestException(i18n.t('exception.INVALID_SOCIAL_PROVIDER'));
    }

    /* Ensure social user data is valid */
    if (!socialUser) {
      throw new BadRequestException(i18n.t('exception.NOT_FOUND', { args: { property: 'User' } }));
    }

    socialUser.email = socialUser.email ?? socialLoginDto.email;
    socialUser.providerType = socialLoginDto.providerType;

    /* Check if a user exists with this email */
    const existingUser = await this.userService.getUserByEmail(socialUser.email);

    if (existingUser && existingUser.deletedAt) {
      throw new BadRequestException(i18n.t('exception.ACCOUNT_DISABLED'));
    }

    /* Find user by provider type & ID */
    const user = await this.userService.getUserByProviderTypeAndId(
      socialUser.providerType,
      socialUser.providerId ?? null,
    );

    socialUser.isSocialLoggedIn = true;

    /* Create or update user */
    const newUser: User = user
      ? await this.userService.createOrUpdate(
          {
            isFirstTimeUser: false,
            language: i18n?.lang ?? Languages.EN,
          },
          user.id,
        )
      : await this.userService.createOrUpdate({
          ...socialUser,
          isFirstTimeUser: true,
          verifiedAt: moment().toDate(),
          fullName: socialLoginDto.fullName,
          language: i18n?.lang ?? Languages.EN,
          isValidUser: true,
          timezone,
        });

    /* Generate authentication tokens */
    const tokens = await this.generateTokens(newUser);

    return { ...newUser, authentication: { ...tokens } };
  }

  /**
   * Logout user
   * @param authUser auth user
   * @param logOutDto log out dto
   * @returns
   */
  async logout(authUser: User, logOutDto: LogOutDto): Promise<void> {
    const { deviceId } = logOutDto;
    if (deviceId) {
      await this.deviceTokenRepository.delete({ deviceId });
    }
    await Promise.all([
      this.accessTokenService.revokeToken(authUser.jti),
      this.refreshTokenService.revokeTokenUsingJti(authUser.jti),
    ]);
  }
}
