import { Transform } from 'class-transformer';
import { DeviceTypes } from 'src/constants/app.constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'app_versions' })
export class AppVersion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Column()
  minVersion: number;

  @Column()
  latestVersion: number;

  @Column({ nullable: true, type: 'text' })
  link: string;

  @Column({ nullable: true, type: 'enum', enum: DeviceTypes })
  platform: DeviceTypes;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
