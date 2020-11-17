import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe, Delete } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
@Controller('ingredients')
export class IngredientController {
  constructor(private ingredientService: IngredientService,
    ) {}

  @Get('/:id')
  async getRecette(
  @Param('id', ParseIntPipe) ingredientId:number): Promise<Ingredient> {
      return this.ingredientService.get(ingredientId);
  }
  
  @Post('')
  @UsePipes(ValidationPipe)
  async postRecette(
    @Body() createIngredientDto: CreateIngredientDto    
  ): Promise<Ingredient> {
    return this.ingredientService.create(createIngredientDto);
  }

  @Delete('/:id')
  async deleteRecette(
    @Param('id', ParseIntPipe) ingredientId: number,
  ): Promise<void>{
    return this.ingredientService.delete(ingredientId);
  }
}
