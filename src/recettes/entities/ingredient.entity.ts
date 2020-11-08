import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    OneToMany,
    ManyToOne,
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

    @Column()
    photopath: string;
}