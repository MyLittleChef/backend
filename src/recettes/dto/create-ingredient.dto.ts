import { IsNotEmpty } from "class-validator";

export class CreateIngredientDto {
    @IsNotEmpty()
    nom: string;

    @IsNotEmpty()
    uniteMesure: string;

}