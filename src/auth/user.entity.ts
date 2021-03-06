import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Recette } from 'src/recettes/entities/recette.entity';
import { Ingredient } from 'src/recettes/entities/ingredient.entity';
import { Regime } from 'src/recettes/entities/regime.enum';
import { NotEquals } from 'class-validator';
import { Mark } from './entity/mark.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  diets: Regime;

  @ManyToMany(() => Ingredient)
  @JoinTable()
  allergies: Ingredient[];

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  resetPasswordToken: string;

  @Column()
  resetPasswordExpires: string;

  @Column()
  cookingFrequence: string;

  @ManyToMany(
    () => Recette,
  )
  @JoinTable()
  toDoRecipes: Recette[];

  @ManyToMany(
    () => Recette,
  )
  @JoinTable()
  starredRecipes: Recette[];

  @ManyToMany(
    () => Recette,
  )
  @JoinTable()
  doneRecipes: Recette[];

  @ManyToMany(() => Ingredient)
  @JoinTable()
  shoppingList: Ingredient[]

  @OneToMany(type => Mark, mark => mark.user, { eager: true })
  marks: Mark[]

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
