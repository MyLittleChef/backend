import { IsNotEmpty } from "class-validator";
import { Regime } from "../entities/regime.enum";

export class EditRecetteDto {
    @IsNotEmpty()
    nom: string;

    @IsNotEmpty()
    duree: string;
    
    @IsNotEmpty()
    difficulte: string;

    @IsNotEmpty()
    ingredients: string[]
    
    @IsNotEmpty()
    nbpersonnes: string;

    @IsNotEmpty()
    regime: Regime;
}