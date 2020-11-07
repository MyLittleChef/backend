import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
} from 'typeorm';
import { Recette } from './recette.entity';

@Entity()
export class Ingredient extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    uniteMesure: string;

    @Column()
    saison: string;

    @ManyToMany(
      type => Recette,
      recette => recette.ingredients,
      {eager: false},
    )
    recettes: Recette[];
}