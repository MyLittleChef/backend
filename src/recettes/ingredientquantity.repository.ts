import { Repository, EntityRepository } from 'typeorm';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import { Difficulty } from './entities/difficulty.enum';
import {
    ConflictException,
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
              throw new ConflictException('Recipe name already exists');
            } else {
              this.logger.verbose(
                `Problem while saving the Recette: ${ingredientquantity.id}, error is : ${error} !`,
              );
              throw new InternalServerErrorException(error);
            }
          }
        return ingredientquantity;

    }
}