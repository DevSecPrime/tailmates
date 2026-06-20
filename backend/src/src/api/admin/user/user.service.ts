import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/api/user/entities/user.entity';
import { UserRoles } from 'src/constants/user.constant';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Get all Users
   * @param search
   * @param page
   * @param limit
   * @returns
   */
  async getAllUsers(search: string, page: number, limit: number): Promise<[User[], number]> {
    const offset = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('u')
      .where('u.role = :role', { role: UserRoles.USER })
      .orderBy('u.createdAt', 'DESC');

    if (search && search.trim() && search !== 'undefined') {
      const normalizedSearch = search.trim();
      queryBuilder.andWhere('(u.fullName ILIKE :search OR u.email ILIKE :search)', {
        search: `%${normalizedSearch}%`,
      });
    }

    const [users, total] = await queryBuilder.skip(offset).take(limit).getManyAndCount();
    return [users, total];
  }

  /**
   * Block/unblock user by admin
   * @param uid
   * @param i18n
   * @returns
   */
  async blockUnblockUser(uid: string): Promise<User> {
    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ isBlocked: () => 'NOT isBlocked' })
      .where('uid = :uid', { uid })
      .returning('*')
      .execute();

    const updatedUser = result.raw[0];
    if (!updatedUser) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', {
          args: { property: 'User' },
        }),
      );
    }
    return updatedUser;
  }
}
