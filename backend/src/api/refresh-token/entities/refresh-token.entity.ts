import { Type } from 'class-transformer';
import { AccessToken } from 'src/api/access-token/entities/access-token.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => AccessToken, accessToken => accessToken.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Type(() => AccessToken)
  accessToken?: Relation<AccessToken>;

  @Column({ nullable: true, type: 'boolean' })
  isRevoked: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
