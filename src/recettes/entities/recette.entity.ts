import {
    BaseEntity,
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { Difficulty } from './difficulty.enum';
import { IngredientQuantity } from './ingredientquantity.entity';
import { Instruction } from './instruction.entity';
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

    @Column("text", { array: true })
    dishTypes: string[];

    @OneToMany(() => Instruction, Instruction => Instruction.recette)
    instructions: Instruction[];

    @Column("text", { array: true })
    materialNeeded: string[];
    
    @Column()
    difficulty: Difficulty;

    @OneToMany(() => IngredientQuantity, ingredientQuantity => ingredientQuantity.recette)
    ingredients: IngredientQuantity[];

    @Column()
    photopath: string;

    @Column("text",{array: true})
    diets: string[];

}