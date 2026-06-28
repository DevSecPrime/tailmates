import { AnimalBehaviourCategory } from 'src/api/animal-behaviour-category/entities/animal-behaviour-category.entity';
import { Expose, Transform } from 'class-transformer';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { dateToTimestamp } from 'src/helpers/date-formatter.helper';

@Entity({ name: 'animal_behaviour_sub_categories' })
export class AnimalBehaviourSubCategory {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  @Expose()
  absId: string;

  @Column({ nullable: true })
  @Expose()
  title: string;

  @Column({ nullable: true })
  @Expose()
  slug: string;

  @Column({
    default: true,
  })
  @Expose()
  isActive: boolean;

  @ManyToOne(() => AnimalBehaviourCategory, category => category.behaviourSubCategories, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  category: Relation<AnimalBehaviourCategory>;

  @CreateDateColumn()
  @Expose()
  @Transform(({ value }) => dateToTimestamp(value))
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
