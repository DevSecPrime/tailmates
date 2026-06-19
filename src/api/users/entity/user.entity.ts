import { Transform } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { dateToTimeStamp } from "../../../common/utils/date-format.helper";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  title!: string;

  @CreateDateColumn()
  @Transform(({ value }) => dateToTimeStamp(value))
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
