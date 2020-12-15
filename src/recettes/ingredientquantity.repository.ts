import { Repository, EntityRepository } from 'typeorm';
import {
    InternalServerErrorException,
    Logger,
  } from '@nestjs/common';
import { IngredientQuantity } from './entities/ingredientquantity.entity';
import { CreateIngredientQuantityDto } from './dto/create-ingredientquantity.dto';
@EntityRepository(IngredientQuantity)
export class IngredientQuantityRepository extends Repository<IngredientQuantity> {
    private logger = new Logger('IngredientQuantityRepository');

    async addIngredientsQuantity(createIngredientQuantityDto:CreateIngredientQuantityDto):Promise<IngredientQuantity>{
        const { ingredientId, quantity } = createIngredientQuantityDto;
        const ingredientquantity = this.create();
        ingredientquantity.ingredient = {id: ingredientId} as any;
        ingredientquantity.quantity = quantity;

        try {
            await ingredientquantity.save();
        } catch (error) {
            if (error.code == 23505) {
              //Duplicate name
              const existing = this.findOne({where: {ingredient: {id: ingredientId} as any, quantity: quantity}});
             return existing;
            } else {
              this.logger.verbose(
                `Problem while saving the Recette: ${ingredientquantity}, error is : ${error} !`,
              );
              throw new InternalServerErrorException(error);
            }
          }
        return ingredientquantity;

    }
}