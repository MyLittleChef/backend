import { IsNotEmpty, IsOptional } from "class-validator";
import { Difficulty } from "../entities/difficulty.enum";
import { Regime } from "../entities/regime.enum";

export class EditRecetteDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    externalId: string;

    @IsNotEmpty()
    readyInMinutes: string;

    @IsNotEmpty()
    servings: string;

    @IsOptional()
    category: string[];

    @IsOptional()
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

    @IsOptional()
    diets: string[];

    @IsNotEmpty()
    photopath: string;

}