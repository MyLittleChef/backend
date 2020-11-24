import { Body, Controller, Get, Param, ParseIntPipe, Post,  UsePipes, ValidationPipe, Delete, UseInterceptors, UploadedFile, Res, Logger } from '@nestjs/common';
import { RecetteService } from './recette.service';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import { imageFileFilter, editFileName } from './file-upload.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {GetConsecutiveRecipesDto} from "./dto/get-consecutive-recipes-dto";

@Controller('recettes')
export class RecetteController {
  private logger = new Logger('RecetteController');
  constructor(private recetteService: RecetteService,
    ) {}

  @Get('/consecutive')
  async getRandomRecipes(
      @Body() getConsecutiveRecipesDto : GetConsecutiveRecipesDto
  ): Promise<Recette[]> {
    return this.recetteService.getConsecutiveRecipes(getConsecutiveRecipesDto);
  }

  @Get('/:id')
  async getRecette(
  @Param('id', ParseIntPipe) recetteId:number): Promise<Recette> {
      return this.recetteService.get(recetteId);
  }

  @Get('/search/:title')
  async getRecetteByName(
    @Param('title') title:string
  ):Promise<Recette>{
    return this.recetteService.getByName(title)
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
    @Body() createRecetteDto: CreateRecetteDto,
    @UploadedFile() file,
  ): Promise<Recette> {
    this.logger.verbose(`Creating recipe ${JSON.stringify(createRecetteDto)}`)
    if(file){
      return this.recetteService.create(createRecetteDto, file.filename);
    } else {
      return this.recetteService.create(createRecetteDto, "no photo provided");
    }
  }

  @Delete('/:id')
  async deleteRecette(
    @Param('id', ParseIntPipe) recetteId: number,
  ): Promise<void>{
    return this.recetteService.remove(recetteId);
  } 
  
  @Get('/image/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }
  
  @Get('/:id/image')
  getImage(
    @Param('id', ParseIntPipe) recipeId:number,
    @Res() res
    ){
      return this.recetteService.getImage(recipeId, res);
    }
  

}
