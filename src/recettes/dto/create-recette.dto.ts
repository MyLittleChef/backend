import { IsNotEmpty } from "class-validator";
import { Regime } from "../entities/regime.enum";
import { Difficulty } from '../entities/difficulty.enum';
export class CreateRecetteDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    externalId: string;

    @IsNotEmpty()
    readyInMinutes: string;

    @IsNotEmpty()
    servings: string;

    @IsNotEmpty()
    category: string;

    @IsNotEmpty()
    dishTypes: string;

    @IsNotEmpty()
    instructions: string;

    @IsNotEmpty()
    materialNeeded: string;
        
    @IsNotEmpty()
    difficulty: Difficulty;

    @IsNotEmpty()
    ingredients: string[]
    
    @IsNotEmpty()
    personsNumber: string;

    @IsNotEmpty()
    diets: string[];

    @IsNotEmpty()
    photopath: string;

}