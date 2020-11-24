import { IsNotEmpty } from "class-validator";
export class GetConsecutiveRecipesDto {
    @IsNotEmpty()
    arraySize: string;

    @IsNotEmpty()
    start: string;
}