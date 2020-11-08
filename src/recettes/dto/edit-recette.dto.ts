import { IsNotEmpty } from "class-validator";
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

    @IsNotEmpty()
    cuisinesType: string;

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
    regime: Regime;

    @IsNotEmpty()
    photopath: string;

    @IsNotEmpty()
    metaInformation: string;
}