import { Expose, Transform, Type } from 'class-transformer';
import { AnimalBehaviourSubCategory } from 'src/api/animal-behaviour-sub-category/entities/animal-behaviour-sub-category.entity';
import { dateToTimestamp } from 'src/helpers/date-formatter.helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'animal_behaviour_categories' })
export class AnimalBehaviourCategory {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Transform(({ value }) => Number(value))
  id: number;

  @Column({ type: 'uuid', default: () => 'gen_random_uuid()' })
  @Expose()
  abcId: string;

  @Column({ nullable: true })
  @Expose()
  title: string;

  @Column({ nullable: true })
  @Expose()
  slug: string;

  @Column({ nullable: true, type: 'text' })
  @Expose()
  description: string;

  @Column({ nullable: true, type: 'boolean', default: true })
  @Expose()
  isActive: boolean;

  @CreateDateColumn()
  @Expose()
  @Transform(({ value }) => dateToTimestamp(value))
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Expose()
  @OneToMany(
    () => AnimalBehaviourSubCategory,
    behaviourSubCategories => behaviourSubCategories.category,
  )
  behaviourSubCategories: Relation<AnimalBehaviourSubCategory>;
}
