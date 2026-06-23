import { AnimalBehaviourCategory } from 'src/api/animal-behaviour-category/entities/animal-behaviour-category.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  absId: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @ManyToOne(() => AnimalBehaviourCategory, category => category.id, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    eager: true,
  })
  category: AnimalBehaviourCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
