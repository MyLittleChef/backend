import { Repository, EntityRepository } from 'typeorm';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import { Difficulty } from './entities/difficulty.enum';
import {
    ConflictException, ForbiddenException,
    InternalServerErrorException,
    Logger,
  } from '@nestjs/common';
import { IngredientQuantity } from './entities/ingredientquantity.entity';
import { Instruction } from './entities/instruction.entity';

@EntityRepository(Recette)
export class RecetteRepository extends Repository<Recette> {
    private logger = new Logger('RecetteRepository');
    
    async createRecette(createRecetteDto: CreateRecetteDto, filename:string, ingredientquantities: IngredientQuantity[], instructions: Instruction[]): Promise<Recette> {
        const { title, provider, difficulty, readyInMinutes, servings, dishTypes, materialNeeded, apiKey, category, diets } = createRecetteDto;
        if (apiKey !== 'c8g6s2e375bf14e47ae411c4ab6751449') {
            throw new ForbiddenException('ApiKey not recognized');
        }
        if((await this.find({where: {provider: provider, title: title}})).length > 0){
            throw new ConflictException(`Recipe ${title} from ${provider} already exists`);
        }
        const recette = this.create();
        recette.title = title;
        recette.provider = provider;
        recette.difficulty = difficulty;
        const getArrayFromStringIfNeeded = function(input) {
          return Array.isArray(input) == false ? new Array(input.toString()) : input;
        };
        recette.ingredients = ingredientquantities.map(ingredientquantity=> ({ id: ingredientquantity.id } as any));
        recette.readyInMinutes = readyInMinutes;
        recette.photopath = filename;
        recette.servings = servings;
        recette.category = category ? getArrayFromStringIfNeeded(category) : [];
        recette.dishTypes = dishTypes ? getArrayFromStringIfNeeded(dishTypes) : [];
        recette.diets = diets ? getArrayFromStringIfNeeded(diets) : [];
        recette.difficulty = difficulty ? difficulty : Difficulty.VOID;
        recette.instructions = instructions;
        recette.materialNeeded = materialNeeded ? getArrayFromStringIfNeeded(materialNeeded) : [];

        try {
            await recette.save();
        } catch (error) {
            if (error.code == 23505) {
              //Duplicate name
              throw new ConflictException(`Recipe ${title} from ${provider} already exists`);
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
