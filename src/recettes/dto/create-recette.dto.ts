import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { Difficulty } from '../entities/difficulty.enum';
import { Provider } from "../entities/provider.enum";
export class CreateRecetteDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsEnum(Provider)
    provider: Provider;

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
    @IsEnum(Difficulty)
    difficulty: Difficulty;

    @IsNotEmpty()
    ingredients: string[]

    @IsOptional()
    diets: string[];

    @IsNotEmpty()
    apiKey: string;
}
