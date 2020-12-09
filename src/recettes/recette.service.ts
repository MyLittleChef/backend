import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetteRepository } from './recette.repository';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import { unlink } from 'fs';
import { IngredientQuantityRepository } from './ingredientquantity.repository';
import { IngredientQuantity } from './entities/ingredientquantity.entity';
import {GetConsecutiveRecipesDto} from "./dto/get-consecutive-recipes-dto";
import {MoreThan} from "typeorm";
import {Instruction} from "./entities/instructions.entity";
import {InstructionRepository} from "./instruction.repository";

@Injectable()
export class RecetteService {
  constructor(
    @InjectRepository(RecetteRepository)
    @InjectRepository(IngredientQuantityRepository)
    @InjectRepository(InstructionRepository)
    private recetteRepository: RecetteRepository,
    private ingredientquantityRepository: IngredientQuantityRepository,
    private instructionRepository: InstructionRepository,
  ) {}
  private logger = new Logger('RecetteService');

  async create(createRecetteDto: CreateRecetteDto, filename:string): Promise<Recette> {
  const getArrayFromStringIfNeeded = function(input) {
      return Array.isArray(input) == false ? new Array(input.toString()) : input;
  };
   const ingredientquantities: IngredientQuantity[] = await Promise.all(getArrayFromStringIfNeeded(createRecetteDto.ingredients).map(
       (ingredient:string) => this.ingredientquantityRepository.addIngredientsQuantity(JSON.parse(ingredient))
       )
   );
   this.logger.verbose(`Created ingredientquantities: ${ingredientquantities} for the recipe: ${JSON.stringify(createRecetteDto)}`);
   const createdRecipe = await this.recetteRepository.createRecette(createRecetteDto, filename, ingredientquantities);
   const instructions : Instruction[] = await Promise.all(getArrayFromStringIfNeeded(createRecetteDto.instructions).map(
       (instruction:string) => this.instructionRepository.createInstruction(JSON.parse(instruction), createdRecipe)
       )
   );
   createdRecipe.instructions = instructions;
   return createdRecipe;
  }

  async get(recetteId: number): Promise<Recette> {
    return  this.recetteRepository.findOne({
       relations: ["ingredients","ingredients.ingredient"],where: { id: recetteId },
     });
   }

  async remove(recetteId: number): Promise<void> {
    const recipe:Recette = await this.recetteRepository.findOne({where: {id:recetteId}});
    const result = await this.recetteRepository.delete({id: recetteId});
    if (result.affected === 0) {
      throw new NotFoundException(`Recette with id "${recetteId}" not found`);
    } else {
      unlink('./files/' + recipe.photopath, () => {
        this.logger.verbose(`Recette of path "${recipe.photopath}" successfully deleted`);
      });
    }
    return;
  }

  getConsecutiveRecipes(getRandomRecipesDto: GetConsecutiveRecipesDto): Promise<Recette[]>{
    const { arraySize, start } = getRandomRecipesDto;

    return this.recetteRepository.find({
      relations: ["ingredients","ingredients.ingredient"], where: { id: MoreThan(parseInt(start)-1)}, take: parseInt(arraySize)
    });
  }

  getByName(title:string):Promise<Recette>{
    return  this.recetteRepository.findOne({
      relations: ["ingredients","ingredients.ingredient"],where: { title: title },
    });
  }

  async getImage(recipeId:number, res){
    const recipe = await this.recetteRepository.findOne({where: {id: recipeId}});
    return res.sendFile(recipe.photopath, { root: './files' });
  }
}
