import { IsNotEmpty } from "class-validator";

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
    nbpersonnes: number;

    @IsNotEmpty()
    regime: string;
}