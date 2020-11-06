import {
    BaseEntity,
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { Regime } from './regime.enum';
@Entity()
@Unique(['nom'])
export class Recette extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    duree: string;

    @Column()
    difficulte: string;

    @ManyToMany(
      type => Ingredient,
      ingredient => ingredient.recettes,
      {eager: true},
    )
    ingredients: Ingredient[];

    @Column()
    nbpersonnes: number;

    @Column()
    photopath: string;

    @Column()
    regime: Regime;



}