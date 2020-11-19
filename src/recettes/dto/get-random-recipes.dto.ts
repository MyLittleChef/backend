import { IsNotEmpty } from "class-validator";
export class GetRandomRecipesDto {
    @IsNotEmpty()
    array_size: string;

    @IsNotEmpty()
    start: string;
}
