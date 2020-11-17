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
       const { nom, uniteMesure } = createIngredientDto;
       const ingredient = this.create();
       ingredient.nom = nom;
       ingredient.uniteMesure = uniteMesure;

       try {
           await ingredient.save();
       } catch (error) {
           if (error.code == 23505) {
             //Duplicate nom
             const existing = this.findOne({where: {nom: nom, uniteMesure: uniteMesure}});
             return existing;
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
