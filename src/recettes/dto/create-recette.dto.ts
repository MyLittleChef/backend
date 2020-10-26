import { IsNotEmpty } from "class-validator";

export class CreateRecetteDto {
    @IsNotEmpty()
    nom: string;

    @IsNotEmpty()
    duree: string;
    
    @IsNotEmpty()
    difficulte: string;

    @IsNotEmpty()

    @IsNotEmpty()
    ingredients: string[]
    
    @IsNotEmpty()
    nbpersonnes: number;

    @IsNotEmpty()
    regime: string;
}