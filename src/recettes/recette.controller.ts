import { Body, Controller, Get, Param, ParseIntPipe, Post,  UsePipes, ValidationPipe, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { RecetteService } from './recette.service';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import { imageFileFilter, editFileName } from './file-upload.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
    @Body() createRecetteDto: CreateRecetteDto,
    @UploadedFile() file,
  ): Promise<Recette> {
    return this.recetteService.create(createRecetteDto, file.filename);
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

}
