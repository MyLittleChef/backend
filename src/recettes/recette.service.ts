import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetteRepository } from './recette.repository';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import { unlink } from 'fs';

@Injectable()
export class RecetteService {
  constructor(
    @InjectRepository(RecetteRepository)
    private recetteRepository: RecetteRepository,
  ) {}
  private logger = new Logger('RecetteService');

  create(createRecetteDto: CreateRecetteDto, filename:string): Promise<Recette> {
    return this.recetteRepository.createRecette(createRecetteDto, filename);
  }
  get(recetteId: number): Promise<Recette> {
     return  this.recetteRepository.findOne({
       relations: ["ingredients"],where: { id: recetteId },
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
}
