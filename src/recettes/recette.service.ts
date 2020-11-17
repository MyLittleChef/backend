import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetteRepository } from './recette.repository';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import { EditRecetteDto } from './dto/edit-recette.dto';
@Injectable()
export class RecetteService {
  constructor(
    @InjectRepository(RecetteRepository)
    private recetteRepository: RecetteRepository,
  ) {}
  private logger = new Logger('RecetteService');

  create(createRecetteDto: CreateRecetteDto): Promise<Recette> {
    return this.recetteRepository.createRecette(createRecetteDto);
  }
  get(recetteId: number): Promise<Recette> {
     return  this.recetteRepository.findOne({
       relations: ["ingredients"],where: { id: recetteId },
     });
   } 
  edit(recetteId: number, editRecetteDto: EditRecetteDto): Promise<Recette> {
    return this.recetteRepository.editRecette(recetteId, editRecetteDto);
  }
  async remove(recetteId: number): Promise<void> {
    const result = await this.recetteRepository.delete({id: recetteId});
    if (result.affected === 0) {
      throw new NotFoundException(`Recette with id "${recetteId}" not found`);
    }
    return;
  }
}
