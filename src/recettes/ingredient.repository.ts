import { Repository, EntityRepository } from 'typeorm';
import {
    ConflictException, ForbiddenException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
   private logger = new Logger('IngredientRepository');
   async createIngredient(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
       const { nom, uniteMesure, apiKey} = createIngredientDto;
       if (apiKey !== 'c8g6s2e375bf14e47ae411c4ab6751449') {
           throw new ForbiddenException('ApiKey not recognized');
       }
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
