import { IsNotEmpty } from "class-validator";

export class GetRecipeMarksDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    apiKey: string;
}
