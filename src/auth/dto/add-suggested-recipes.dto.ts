import { IsNotEmpty, IsOptional } from "class-validator";

export class AddSuggestedRecipesDto {
    @IsOptional()
    suggestedRecipesIds: string[];

    @IsNotEmpty()
    apiKey: string;
}
