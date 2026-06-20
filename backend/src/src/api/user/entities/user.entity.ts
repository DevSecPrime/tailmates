import { Expose, Transform, Type } from 'class-transformer';
import { Languages } from 'src/constants/app.constant';
import { AdminRoles, ProviderTypes, UserRoles } from 'src/constants/user.constant';
import { dateToTimestamp } from 'src/helpers/date-formatter.helper';
import { castToStorage } from 'src/helpers/file-upload.helper';
import { isUrlValid } from 'src/helpers/utils.helper';
import { AuthTokenResource } from 'src/resources/auth-token.resource';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  public jti?: string;
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Column({ nullable: true, length: 50 })
  @Expose()
  uid: string;

  @Column({ type: 'enum', enum: Languages, default: Languages.EN })
  @Expose()
  language: Languages | string;

  @Column({ type: 'enum', enum: AdminRoles, nullable: true })
  @Expose()
  adminRole: AdminRoles | string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  @Expose()
  role: UserRoles | string;

  @Column({ nullable: true, length: 100 })
  @Expose()
  email: string;

  @Column({ nullable: true })
  @Expose()
  password: string;

  @Column({ nullable: true, length: 6 })
  verificationCode: string;

  @Column({ nullable: true, type: 'timestamp' })
  verificationCodeExpiresAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  verifiedAt: Date;

  @Column({ nullable: true, length: 60 })
  @Expose()
  timezone: string;

  @Column({ nullable: true })
  @Expose()
  fullName: string;

  @Column({ nullable: true })
  @Expose()
  useName: string;

  @Column({ nullable: true, type: 'text' })
  @Transform(({ value }) => (isUrlValid(value) ? value : castToStorage(value)))
  @Expose()
  profilePic: string;

  @Column({ default: true })
  @Expose()
  isNotificationOn: boolean;

  @Column({ default: false })
  @Expose()
  isBlocked: boolean;

  @Column({ default: false })
  @Expose()
  isProfileSetUpCompleted: boolean;

  @Expose()
  @Column({ default: true })
  isFirstTimeUser: boolean;

  @Column({ default: false })
  @Expose()
  isSocialLoggedIn: boolean;

  @Column({ default: false })
  @Expose()
  isValidUser: boolean;

  @Column({ nullable: true })
  providerId: string;

  @Expose()
  @Column({ nullable: true, type: 'enum', enum: ProviderTypes })
  providerType: ProviderTypes;

  @CreateDateColumn()
  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Expose()
  @Type(() => AuthTokenResource)
  authentication: AuthTokenResource;
}
