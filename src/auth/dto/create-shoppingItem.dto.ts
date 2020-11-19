import { IsNotEmpty } from "class-validator";

export class CreateShoppingItemDto {
    @IsNotEmpty()
    ingredientId: number;

    @IsNotEmpty()
    quantity: number;
}
