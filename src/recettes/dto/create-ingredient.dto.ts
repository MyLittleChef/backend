import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateIngredientDto {
    @IsNotEmpty()
    nom: string;

    @IsOptional()
    uniteMesure: string;

    @IsNotEmpty()
    apiKey: string;
}
