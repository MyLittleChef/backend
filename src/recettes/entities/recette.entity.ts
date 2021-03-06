import {
    BaseEntity,
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Difficulty } from './difficulty.enum';
import { Ingredient } from './ingredient.entity';
import { Regime } from './regime.enum';
@Entity()
@Unique(['externalId'])
export class Recette extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    externalId: string;

    @Column()
    readyInMinutes: string;

    @Column()
    servings: string;

    @Column("text",{array: true})
    category: string[];

    @Column()
    dishTypes: string;

    @Column()
    instructions: string;

    @Column()
    materialNeeded: string;
    
    @Column()
    difficulty: Difficulty;

    @ManyToMany(
      () => Ingredient,
    )
    @JoinTable()
    ingredients: Ingredient[];

    @Column()
    photopath: string;

    @Column("text",{array: true})
    diets: string[];

}