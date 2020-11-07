import { Repository, EntityRepository } from 'typeorm';
import {
    ConflictException,
    InternalServerErrorException,
    Logger,
  } from '@nestjs/common';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
    private logger = new Logger('IngredientRepository');
    async createIngredient(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
        const { nom, uniteMesure, saison } = createIngredientDto;
        const ingredient = this.create();
        ingredient.nom = nom;
        ingredient.uniteMesure = uniteMesure;
        ingredient.saison = saison;

        try {
            await ingredient.save();
        } catch (error) {
            if (error.code === 23505) {
              //Duplicate nom
              throw new ConflictException('Name of ingredient already exists');
            } else {
              this.logger.verbose(
                `Problem while saving the Recette: ${ingredient.nom}, error is : ${error} !`,
              );
              throw new InternalServerErrorException(error);
            }
          }
        return ingredient;
    }
}
