import { IsNotEmpty } from "class-validator";

export class CreateInstructionDto {
    @IsNotEmpty()
    recipeId: number;

    @IsNotEmpty()
    index: number;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    apiKey: string;
}