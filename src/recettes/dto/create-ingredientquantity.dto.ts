import { IsNotEmpty } from "class-validator";

export class CreateIngredientQuantityDto {
    @IsNotEmpty()
    ingredientId: number;

    @IsNotEmpty()
    quantity: number;

}
