import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { comparePassword, encodePassword } from 'src/helpers/bcrypt.helper';
import { AdminLoginDto } from './dto/admin-login.dto';
import { I18nService } from 'nestjs-i18n';
import { UserRoles } from 'src/constants/user.constant';
import { AccessTokenService } from '../access-token/access-token.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import moment from 'moment';

@Injectable()
export class AdminService {
  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Find admin by email
   * @param email email of the admin
   * @returns
   */
  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase().trim(), role: UserRoles.ADMIN },
    });
  }

  /**
   * Login admin
   * @param loginDto login dto
   * @returns
   */
  async login(loginDto: AdminLoginDto) {
    const { email, password } = loginDto;
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException(this.i18n.t('exception.ADMIN_NOT_FOUND'));
    }
    if (!comparePassword(password, user.password)) {
      throw new ConflictException(this.i18n.t('exception.INVALID_PASSWORD'));
    }
    const authentication = await this.generateTokens(user as User);
    return { ...user, authentication };
  }

  /**
   * Generate tokens
   * @param user user
   * @returns
   */
  async generateTokens(user: User) {
    const { decodedToken, jwtToken } = await this.accessTokenService.createToken(user);
    const refreshToken = await this.refreshTokenService.createToken(decodedToken);
    return {
      accessToken: jwtToken,
      refreshToken,
      expiresAt: decodedToken['exp'],
    };
  }

  /**
   * Change password
   * @param authUser
   * @param adminChangePasswordDto
   * @returns
   */
  async changePassword(authUser: User, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;
    if (!comparePassword(oldPassword, authUser.password)) {
      throw new BadRequestException(this.i18n.t('exception.ENTER_VALID_PASSWORD'));
    }
    if (comparePassword(newPassword, authUser.password)) {
      throw new BadRequestException(this.i18n.t('exception.NEW_PASSWORD_CANNOT_BE_SAME'));
    }
    await this.userRepository.update(authUser.id, {
      password: encodePassword(newPassword),
    });

    return;
  }

  /**
   * Dashboard data
   * @param email
   * @returns
   */
  async dashboardData() {
    const users = await this.userRepository.find({
      where: { role: UserRoles.USER },
      order: { createdAt: 'DESC' },
    });

    const thisMonthUsers = await this.userRepository.count({
      where: {
        role: UserRoles.USER,
        createdAt: Between(moment().startOf('month').toDate(), moment().endOf('month').toDate()),
      },
    });

    const todayUsers = await this.userRepository.count({
      where: {
        role: UserRoles.USER,
        createdAt: Between(moment().startOf('day').toDate(), moment().endOf('day').toDate()),
      },
    });

    const monthArrayList1 = [];
    let totalUsers = users.length + 1;
    users.length > 0 &&
      users.map((user: User) => {
        totalUsers -= 1;
        if (!monthArrayList1.includes(moment(user.createdAt).format('MMM, YYYY'))) {
          monthArrayList1.push({
            date: moment(user.createdAt).format('MMM, YYYY'),
            value: 1,
            total: totalUsers,
          });
        }
      });

    const usersGraphData = [];
    monthArrayList1.length > 0 &&
      monthArrayList1.reduce((res, value) => {
        if (!res[value.date]) {
          res[value.date] = {
            date: value.date,
            value: 0,
            total: value.total,
          };
          usersGraphData.push(res[value.date]);
        }
        res[value.date].value += value.value;
        return res;
      }, {});

    return {
      totalUsers: users.length,
      registeredThisMonthUsers: thisMonthUsers,
      todayUsers,
      usersGraphData: usersGraphData.slice(0, 6).sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return moment(new Date(a.date)).unix() - moment(new Date(b.date)).unix();
      }),
    };
  }

  /**
   * Logout admin
   * @param user
   */
  async logout(user: User): Promise<void> {
    await Promise.all([
      this.accessTokenService.revokeToken(user.jti),
      this.refreshTokenService.revokeTokenUsingJti(user.jti),
    ]);
  }
}
