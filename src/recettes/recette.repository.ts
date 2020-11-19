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
@EntityRepository(Recette)
export class RecetteRepository extends Repository<Recette> {
    private logger = new Logger('RecetteRepository');
    
    async createRecette(createRecetteDto: CreateRecetteDto, filename:string, ingredientquantities: IngredientQuantity[]): Promise<Recette> {
      const { title, provider, difficulty, readyInMinutes, servings, dishTypes, instructions, materialNeeded } = createRecetteDto;
      let { ingredients, category, diets} = createRecetteDto;
      const recette = this.create();
        recette.title = title;
        recette.provider = provider;
        recette.difficulty = difficulty;
        const getArrayFromStringIfNeeded = function(input) {
          return Array.isArray(input) == false ? new Array(input.toString()) : input;
        };
        ingredients = getArrayFromStringIfNeeded(ingredients);
        recette.ingredients = ingredientquantities.map(ingredientquantity=> ({ id: ingredientquantity.id } as any));
        recette.readyInMinutes = readyInMinutes;
        recette.photopath = filename;
        recette.servings = servings;
        recette.category = category ? getArrayFromStringIfNeeded(category) : [];
        recette.dishTypes = dishTypes ? dishTypes : "";
        recette.diets = diets ? getArrayFromStringIfNeeded(diets) : [];
        recette.difficulty = difficulty ? difficulty : Difficulty.VOID;
        recette.instructions = instructions ? instructions : "";
        recette.materialNeeded = materialNeeded ? materialNeeded : "";

        try {
            await recette.save();
        } catch (error) {
            if (error.code === 23505) {
              //Duplicate name
              throw new ConflictException('Recipe name already exists');
            } else {
              this.logger.verbose(
                `Problem while saving the Recette: ${recette.title}, error is : ${error} !`,
              );
              throw new InternalServerErrorException(error);
            }
          }
        return recette;
    }
}
