import { Body, Controller, Put, Get, Param, ParseIntPipe, Post, UseInterceptors, UsePipes, ValidationPipe, Delete } from '@nestjs/common';
import { RecetteService } from './recette.service';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, editFileName } from './file-upload.utils';
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
    return this.recetteService.create(createRecetteDto);
  }

  @Put('/:id')
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
