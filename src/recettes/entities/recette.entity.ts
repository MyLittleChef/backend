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
import { Provider } from './provider.entity';
@Entity()
@Unique(['externalId'])
export class Recette extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    providerId: Provider;

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