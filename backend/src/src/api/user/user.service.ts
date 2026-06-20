import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { generateUniqueId } from 'src/helpers/utils.helper';
import { I18nService } from 'nestjs-i18n';
import { Improvement } from './entities/improvement.entity';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { ProviderTypes } from 'src/constants/user.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Improvement)
    private readonly improvementRepository: Repository<Improvement>,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Get user by email
   * @param email email of the user
   * @returns
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .andWhere('user.deletedAt IS NULL')
      .getOne();

    return user;
  }

  /**
   * Find user by provider Id and token
   * @param providerType
   * @param providerId
   */
  async getUserByProviderTypeAndId(providerType: ProviderTypes, providerId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { providerType, providerId },
    });
  }

  /**
   * Get user details
   * @param uid uid of the user
   * @returns
   */
  async getUserDetails(uid: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.uid = :uid', { uid })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  /**
   * Get user by id
   * @param id id of the user
   * @returns
   */
  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'user' } }),
      );
    }
    return await this.getUserDetails(user.uid);
  }

  /**
   * Create or update user
   * @param data data of the user
   * @param userId id of the user
   * @returns
   */
  async createOrUpdate(data: Partial<User>, userId: number = null): Promise<User> {
    if (userId) {
      await this.userRepository.update(userId, data);
    } else {
      const user = await this.userRepository.save(
        this.userRepository.create({
          ...data,
          uid: generateUniqueId('U'),
        }),
      );

      userId = user.id ?? null;
    }

    return await this.getUserById(userId);
  }

  /**
   * Delete user account
   * @param authUser auth user
   * @param deleteAccountDto
   * @returns
   */
  async deleteAccount(authUser: User, deleteAccountDto: DeleteAccountDto): Promise<boolean> {
    if (deleteAccountDto.reason) {
      await this.improvementRepository.save(
        this.improvementRepository.create({
          description: deleteAccountDto.reason,
          iid: generateUniqueId('I'),
          user: { id: authUser.id },
        }),
      );
    }
    await this.userRepository.softDelete({ id: authUser.id });
    return true;
  }
}
