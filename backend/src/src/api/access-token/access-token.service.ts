import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from './entities/access-token.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { randomBytes } from 'crypto';
import moment from 'moment';

@Injectable()
export class AccessTokenService {
  constructor(
    @InjectRepository(AccessToken) private readonly accessTokenRepository: Repository<AccessToken>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Find one access token
   * @param id access token id
   * @returns
   */
  async findOne(id: string | number): Promise<AccessToken> {
    return await this.accessTokenRepository
      .createQueryBuilder('at')
      .leftJoinAndSelect('at.user', 'u')
      .where('at.id = :id', { id })
      .getOne();
  }

  /**
   * Create access token
   * @param user
   * @returns
   */
  async createToken(user: User): Promise<{
    accessToken: AccessToken;
    jwtToken: string;
    decodedToken: { iat: number; exp: number; jti: string };
  }> {
    const payload = {
      uid: user.uid,
      sub: user.uid,
      iss: process.env.APP_URL,
      jti: randomBytes(32).toString('hex'),
    };
    const jwtToken = this.jwtService.sign(payload);
    const decodedToken = await this.jwtService.decode(jwtToken);
    const { iat, exp, jti } = decodedToken;
    const createdAt = moment.unix(iat).toDate();
    const expiresAt = moment.unix(exp).toDate();

    const accessToken = await this.accessTokenRepository.save(
      this.accessTokenRepository.create({
        id: jti,
        expiresAt,
        createdAt,
        user: { id: user.id },
      }),
    );

    return { accessToken, jwtToken, decodedToken };
  }

  /**
   * Revoke access token
   * @param jwtUniqueIdentifier
   * @returns
   */
  async revokeToken(jwtUniqueIdentifier: string): Promise<void> {
    await this.accessTokenRepository.update({ id: jwtUniqueIdentifier }, { isRevoked: true });
  }
}
