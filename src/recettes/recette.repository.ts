import { Repository, EntityRepository } from 'typeorm';
import { Recette } from './entities/recette.entity';
import { CreateRecetteDto } from './dto/create-recette.dto';
import {
    ConflictException,
    InternalServerErrorException,
    Logger,
    NotFoundException,
  } from '@nestjs/common';
import { EditRecetteDto } from './dto/edit-recette.dto';
@EntityRepository(Recette)
export class RecetteRepository extends Repository<Recette> {
    private logger = new Logger('RecetteRepository');
    async createRecette(createRecetteDto: CreateRecetteDto): Promise<Recette> {
        const { nom, duree, difficulte, ingredients, nbpersonnes, regime } = createRecetteDto;
        const recette = this.create();
        recette.nom = nom;
        recette.duree = duree;
        recette.difficulte = difficulte;
        recette.ingredients = ingredients.map(ingredientId => ({ id: ingredientId } as any));
        recette.regime = regime;
        recette.nbpersonnes = nbpersonnes;
        recette.photopath = "/root/";
        
        try {
            await recette.save();
        } catch (error) {
            if (error.code === 23505) {
              //Duplicate nom
              throw new ConflictException('Name of recipe already exists');
            } else {
              this.logger.verbose(
                `Problem while saving the Recette: ${recette.nom}, error is : ${error} !`,
              );
              throw new InternalServerErrorException(error);
            }
          }
        return recette;
    }
    async editRecette(recetteId: number,editRecetteDto: EditRecetteDto): Promise<Recette> {
        const { nom, duree, difficulte, ingredients, nbpersonnes, regime } = editRecetteDto;
        const recette = await this.findOne({
            id: recetteId,
          });
        if(recette){
            recette.nom = nom;
            recette.duree = duree;
            recette.difficulte = difficulte;
            recette.ingredients = ingredients.map(ingredientId => ({ id: ingredientId } as any));
            recette.regime = { id: regime } as any;
            recette.nbpersonnes = nbpersonnes;
            try {
                await recette.save();
              } catch (error) {
                this.logger.error(
                  `Failed to edit a recette Data: ${JSON.stringify(editRecetteDto)}`,
                  error.stack,
                );
                throw new InternalServerErrorException();
              }
        } else {
              throw new NotFoundException('Edited Recette does not exist');
        }
        return recette;
     }
}
