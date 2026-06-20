import { Expose, Transform, Type } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { dateToTimestamp } from 'src/helpers/date-formatter.helper';
import { User } from './user.entity';

@Entity({ name: 'improvements' })
export class Improvement {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  @Expose()
  id: number;

  @Column({ length: 50 })
  @Expose()
  iid: string;

  @Column({ type: 'text' })
  @Expose()
  description: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @Type(() => User)
  user?: Relation<User>;

  @CreateDateColumn()
  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
