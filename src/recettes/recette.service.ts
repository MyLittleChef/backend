import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetteRepository } from './recette.repository';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import { unlink } from 'fs';
import { IngredientQuantityRepository } from './ingredientquantity.repository';
import { IngredientQuantity } from './entities/ingredientquantity.entity';
import { CreateIngredientQuantityDto } from './dto/create-ingredientquantity.dto';
import {GetConsecutiveRecipesDto} from "./dto/get-consecutive-recipes-dto";
import {MoreThan} from "typeorm";

@Injectable()
export class RecetteService {
  constructor(
    @InjectRepository(RecetteRepository)
    @InjectRepository(IngredientQuantityRepository)
    private recetteRepository: RecetteRepository,
    private ingredientquantityRepository: IngredientQuantityRepository
  ) {}
  private logger = new Logger('RecetteService');

  async create(createRecetteDto: CreateRecetteDto, filename:string): Promise<Recette> {
   const ingredientquantities: IngredientQuantity[] = await Promise.all(createRecetteDto.ingredients.map((ingredient:CreateIngredientQuantityDto) => this.ingredientquantityRepository.addIngredientsQuantity(ingredient)));
   console.log(ingredientquantities);
   return this.recetteRepository.createRecette(createRecetteDto, filename, ingredientquantities);
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
    const { array_size, start } = getRandomRecipesDto;

    return this.recetteRepository.find({
      relations: ["ingredients"], where: { id: MoreThan(parseInt(start)-1)}, take: parseInt(array_size)
    });
  }
}
