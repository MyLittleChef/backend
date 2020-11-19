import { Module } from '@nestjs/common';
import { RecetteController } from './recette.controller';
import { RecetteService } from './recette.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetteRepository } from './recette.repository'
import { IngredientRepository } from './ingredient.repository';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';
import { IngredientQuantityRepository } from './ingredientquantity.repository';
@Module({
  imports: [TypeOrmModule.forFeature([RecetteRepository]), 
  TypeOrmModule.forFeature([IngredientRepository]),
  TypeOrmModule.forFeature([IngredientQuantityRepository])],
  
  controllers: [RecetteController, IngredientController],
  providers: [RecetteService, IngredientService],
})
export class RecetteModule {}
