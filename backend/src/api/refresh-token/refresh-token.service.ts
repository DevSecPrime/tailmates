import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import moment from 'moment';
import { randomBytes } from 'crypto';
import { encrypt } from 'src/helpers/utils.helper';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Find one refresh token
   * @param id refresh token id
   * @returns
   */
  async findOne(id: string): Promise<RefreshToken> {
    return await this.refreshTokenRepository
      .createQueryBuilder('rt')
      .leftJoinAndSelect('rt.accessToken', 'at')
      .leftJoinAndSelect('at.user', 'u')
      .where('rt.id = :id', { id })
      .getOne();
  }

  /**
   * Create refresh token
   * @param decodedToken
   * @returns
   */
  async createToken(decodedToken: { iat: number; exp: number; jti: string }): Promise<string> {
    const refreshTokenLifeTime = moment.unix(decodedToken.exp).add(30, 'days').toDate();
    const refreshToken = randomBytes(64).toString('hex');

    await this.refreshTokenRepository.save(
      this.refreshTokenRepository.create({
        id: refreshToken,
        expiresAt: refreshTokenLifeTime,
        accessToken: {
          id: decodedToken.jti,
        },
      }),
    );

    return encrypt(refreshToken);
  }

  /**
   * Revoke refresh token using jti
   * @param jwtUniqueIdentifier
   */
  async revokeTokenUsingJti(jwtUniqueIdentifier: string): Promise<void> {
    await this.refreshTokenRepository.update({ id: jwtUniqueIdentifier }, { isRevoked: true });
  }
}
