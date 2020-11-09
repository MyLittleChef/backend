import { Recette } from "src/recettes/entities/recette.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../user.entity";
import { Score } from "./score.enum";

@Entity()
@Unique(['recipeId'])
export class Mark extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  recipeId: string;

  @Column()
  score: Score;

  @ManyToOne(() => User, user => user.marks, {eager: false})
  user: User;
}