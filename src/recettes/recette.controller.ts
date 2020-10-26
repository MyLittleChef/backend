import { Body, Controller, Get, Param, ParseIntPipe, Post, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { RecetteService } from './recette.service';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, editFileName } from './file-upload.utils';
import { IngredientService } from './ingredient.service';
import { Regime } from './entities/regime.entity';
import { Ingredient } from './entities/ingredient.entity';

@Controller('recettes')
export class RecetteController {
  constructor(private recetteService: RecetteService,
    private ingredientService: IngredientService
    ) {}

  @Get('/recette/:id')
  async getRecette(
  @Param('id', ParseIntPipe) id:number): Promise<Recette> {
      return this.recetteService.getRecette(id);
  }
  
  @Post('/recette')
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
    @Body() createRecetteDto: CreateRecetteDto    
  ): Promise<Recette> {
    const ingredients: Ingredient[] = this.ingredientService.getHello();
    const regime: Regime = this.regimeService.getHello();
    return this.recetteService.postRecette(createRecetteDto, ingredients, regime);
  }
  

  
}
