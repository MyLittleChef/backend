import { IsEnum, IsNotEmpty } from "class-validator";
import { Score } from "../entity/score.enum";

export class CreateMarkDto {
    @IsNotEmpty()
    recipeId: string;

    @IsNotEmpty()
    @IsEnum(Score)
    score: Score;
}
