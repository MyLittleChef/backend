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
      const { title, externalId, difficulty, ingredients, readyInMinutes, regime, photopath, servings, mealType, instructions, materialNeeded, personsNumber, metaInformation  } = createRecetteDto;
      const recette = this.create();
        recette.title = title;
        recette.externalId = externalId;
        recette.difficulty = difficulty;
        recette.ingredients = ingredients.map(ingredientId => ({ id: ingredientId } as any));
        recette.regime = regime;
        recette.readyInMinutes = readyInMinutes;
        recette.photopath = photopath;
        recette.servings = servings;
        recette.mealType = mealType;
        recette.instructions = instructions;
        recette.materialNeeded = materialNeeded;
        recette.personsNumber = personsNumber;
        recette.metaInformation = metaInformation;
        
        try {
            await recette.save();
        } catch (error) {
            if (error.code === 23505) {
              //Duplicate nom
              throw new ConflictException('Name of recipe already exists');
            } else {
              this.logger.verbose(
                `Problem while saving the Recette: ${recette.title}, error is : ${error} !`,
              );
              throw new InternalServerErrorException(error);
            }
          }
        return recette;
    }
    async editRecette(recetteId: number,editRecetteDto: EditRecetteDto): Promise<Recette> {
        const { title, externalId, difficulty, ingredients, readyInMinutes, regime, photopath, servings, mealType, instructions, materialNeeded, personsNumber, metaInformation  } = editRecetteDto;
        const recette = await this.findOne({
            id: recetteId,
          });
        if(recette){
          recette.title = title;
          recette.externalId = externalId;
          recette.difficulty = difficulty;
          recette.ingredients = ingredients.map(ingredientId => ({ id: ingredientId } as any));
          recette.regime = regime;
          recette.readyInMinutes = readyInMinutes;
          recette.photopath = photopath;
          recette.servings = servings;
          recette.mealType = mealType;
          recette.instructions = instructions;
          recette.materialNeeded = materialNeeded;
          recette.personsNumber = personsNumber;
          recette.metaInformation = metaInformation;

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
