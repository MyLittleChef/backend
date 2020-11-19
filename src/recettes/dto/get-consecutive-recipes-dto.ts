import { IsNotEmpty } from "class-validator";
export class GetConsecutiveRecipesDto {
    @IsNotEmpty()
    array_size: string;

    @IsNotEmpty()
    start: string;
}