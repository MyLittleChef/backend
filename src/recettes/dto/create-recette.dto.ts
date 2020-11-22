import { IsNotEmpty, IsOptional } from "class-validator";
import { Difficulty } from '../entities/difficulty.enum';
import { Provider } from "../entities/provider.enum";
import { CreateIngredientQuantityDto } from "./create-ingredientquantity.dto";
export class CreateRecetteDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
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
    difficulty: Difficulty;

    @IsNotEmpty()
    ingredients: string[]

    @IsOptional()
    diets: string[];

    @IsNotEmpty()
    apiKey: string;
}
