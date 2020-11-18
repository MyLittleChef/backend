import { IsNotEmpty, IsOptional } from "class-validator";
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

    @IsOptional()
    category: string[];

    @IsOptional()
    dishTypes: string;

    @IsOptional()
    instructions: string;

    @IsOptional()
    materialNeeded: string;

    @IsOptional()
    difficulty: Difficulty;

    @IsNotEmpty()
    ingredients: string[]

    @IsOptional()
    diets: string[];

}
