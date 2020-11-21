import {
    BaseEntity,
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';
import { Difficulty } from './difficulty.enum';
import { Ingredient } from './ingredient.entity';
import { IngredientQuantity } from './ingredientquantity.entity';
import { Provider } from './provider.enum';
@Entity()
@Unique(['provider','title'])
export class Recette extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    provider: Provider;

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

    @OneToMany(() => IngredientQuantity, ingredientQuantity => ingredientQuantity.recette)
    @JoinTable()
    ingredients: IngredientQuantity[];

    @Column()
    photopath: string;

    @Column("text",{array: true})
    diets: string[];

}