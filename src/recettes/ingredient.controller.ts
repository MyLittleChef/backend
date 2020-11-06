import { Body, Controller, Get, Param, ParseIntPipe, Post, UseInterceptors, UsePipes, ValidationPipe, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, editFileName } from './file-upload.utils';
import { IngredientService } from './ingredient.service';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';

@Controller('ingredient')
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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async postRecette(
    @Body() createIngredientDto: CreateIngredientDto    
  ): Promise<Ingredient> {
    return this.ingredientService.create(createIngredientDto);
  }

  @Delete('/recette/:id')
  async deleteRecette(
    @Param('id', ParseIntPipe) ingredientId: number,
  ): Promise<void>{
    return this.ingredientService.delete(ingredientId);
  }
  

  
}
