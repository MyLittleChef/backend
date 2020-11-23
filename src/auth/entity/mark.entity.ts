import { Recette } from "src/recettes/entities/recette.entity";
import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import { User } from "../user.entity";
import { Score } from "./score.enum";

@Entity()
@Unique(['recipe', 'user'])
export class Mark extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recette, recette => recette.id)
  recipe: Recette;

  @Column()
  score: Score;

  @ManyToOne(() => User, user => user.marks, {eager: false})
  user: User;
}