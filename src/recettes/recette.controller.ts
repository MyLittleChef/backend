import { Body, Controller, Put, Get, Param, ParseIntPipe, Post,  UsePipes, ValidationPipe, Delete } from '@nestjs/common';
import { RecetteService } from './recette.service';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import { EditRecetteDto } from './dto/edit-recette.dto';

@Controller('recettes')
export class RecetteController {
  constructor(private recetteService: RecetteService,
    ) {}

  @Get('/:id')
  async getRecette(
  @Param('id', ParseIntPipe) recetteId:number): Promise<Recette> {
      return this.recetteService.get(recetteId);
  }
  
  @Post('')
  @UsePipes(ValidationPipe)
  async postRecette(
    @Body() createRecetteDto: CreateRecetteDto    
  ): Promise<Recette> {
    return this.recetteService.create(createRecetteDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async editRecette(
    @Body() editRecetteDto: EditRecetteDto,
    @Param('id', ParseIntPipe) recetteId:number     
  ): Promise<Recette> {
    return this.recetteService.edit(recetteId, editRecetteDto);
  }

  @Delete('/:id')
  async deleteRecette(
    @Param('id', ParseIntPipe) recetteId: number,
  ): Promise<void>{
    return this.recetteService.remove(recetteId);
  }

}
