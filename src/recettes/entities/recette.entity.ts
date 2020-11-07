import {
    BaseEntity,
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
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
      () => Ingredient,
    )
    @JoinTable()
    ingredients: Ingredient[];

    @Column()
    nbpersonnes: string;

    @Column()
    photopath: string;

    @Column()
    regime: Regime;



}