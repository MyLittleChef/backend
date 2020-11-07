import { IsNotEmpty, IsOptional } from "class-validator";
import { Saison } from "../entities/saison.enum";
import { UniteMesure } from "../entities/unite-mesure.enum";

export class CreateIngredientDto {
    @IsNotEmpty()
    nom: string;

    @IsNotEmpty()
    uniteMesure: UniteMesure;

    @IsNotEmpty()    
    saison: Saison;
}