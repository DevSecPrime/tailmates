import { Type } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'access_tokens' })
export class AccessToken {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @Type(() => User)
  user?: Relation<User>;

  @Column({ nullable: true, default: false })
  isRevoked: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
