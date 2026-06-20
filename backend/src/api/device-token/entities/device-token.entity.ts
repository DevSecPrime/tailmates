import { Type } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
import { DeviceTypes } from 'src/constants/app.constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'device_tokens' })
export class DeviceToken {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  deviceId: string;

  @Column({
    type: 'enum',
    enum: DeviceTypes,
    default: DeviceTypes.IOS,
  })
  deviceType: DeviceTypes;

  @Column({ type: 'text', nullable: true })
  token: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @Type(() => User)
  user?: Relation<User>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
