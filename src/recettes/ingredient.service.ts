import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientRepository } from './ingredient.repository';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(IngredientRepository)
    private ingredientRepository: IngredientRepository,
  ) {}
  get(ingredientId:number): Promise<Ingredient> {
    return this.ingredientRepository.findOne({
      where: { id: ingredientId },
    });
  }
  create(createIngredientDto:CreateIngredientDto): Promise<Ingredient> {
    return this.ingredientRepository.createIngredient(createIngredientDto);
  }
  async delete(ingredientId:number): Promise<void> {
    const result = await this.ingredientRepository.delete({id: ingredientId});
    if (result.affected === 0) {
      throw new NotFoundException(`Ingredient with id "${ingredientId}" not found`);
    }
    return;
  }
}
