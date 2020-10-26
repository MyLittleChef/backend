import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Recette } from './recette.entity';
@Entity()
export class Regime extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @OneToMany(
      type => Recette,
      recette => recette.regime,
      {eager: true},
    )
    recettes: Recette[];

}