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
    unite_mesure: string;

    @Column()
    saison: string;

    @ManyToMany(
      type => Recette,
      recette => recette.ingredients,
      {eager: true},
    )
    recettes: Recette[];
}