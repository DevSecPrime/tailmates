import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { I18nService } from 'nestjs-i18n';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenService } from 'src/api/access-token/access-token.service';
import { IJwtPayload } from 'src/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly i118n: I18nService,
    private readonly accessTokensService: AccessTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.APP_KEY,
    });
  }

  /**
   * Validate user
   * @param payload
   * @returns
   */
  async validate(payload: IJwtPayload) {
    const accessToken = await this.accessTokensService.findOne(payload?.jti);

    // 1️⃣ Token record not found in DB
    if (!accessToken) {
      throw new UnauthorizedException(
        this.i118n.t('exception.ERROR', {
          args: { property: 'Access token not found or invalid.' },
        }),
      );
    }

    // 2️⃣ Token has no user association
    if (!accessToken?.user) {
      throw new UnauthorizedException(
        this.i118n.t('exception.ERROR', {
          args: { property: 'No user associated with this token.' },
        }),
      );
    }

    // 3️⃣ Token expired
    if (!accessToken?.expiresAt || Date.now() > accessToken.expiresAt.getTime()) {
      throw new UnauthorizedException(
        this.i118n.t('exception.ERROR', {
          args: { property: 'Your session has expired. Please log in again.' },
        }),
      );
    }

    // 4️⃣ Token revoked
    if (accessToken.isRevoked) {
      throw new UnauthorizedException(
        this.i118n.t('exception.ERROR', {
          args: { property: 'This token has been revoked. Please log in again.' },
        }),
      );
    }

    // 5️⃣ User account soft-deleted
    if (accessToken.user.deletedAt) {
      throw new UnauthorizedException(
        this.i118n.t('exception.ERROR', {
          args: { property: 'Your account has been deleted.' },
        }),
      );
    }

    // 6️⃣ User account not verified
    if (!accessToken.user.verifiedAt) {
      throw new UnauthorizedException(
        this.i118n.t('exception.ERROR', {
          args: { property: 'Please verify your account to continue.' },
        }),
      );
    }

    // 7️⃣ User blocked by admin
    if (accessToken.user.isBlocked) {
      throw new UnauthorizedException(
        this.i118n.t('exception.ERROR', {
          args: {
            property:
              'Your account has been blocked by the administrator. Please contact support for assistance.',
          },
        }),
      );
    }

    // ✅ Everything valid — return the user info
    return {
      ...accessToken.user,
      jti: payload.jti,
    };
  }
}
