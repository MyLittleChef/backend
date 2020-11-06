import { Module } from '@nestjs/common';
import { RecetteController } from './recette.controller';
import { RecetteService } from './recette.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetteRepository } from './recette.repository'
import { IngredientRepository } from './ingredient.repository';
@Module({
  imports: [TypeOrmModule.forFeature([RecetteRepository, IngredientRepository])],
  controllers: [RecetteController],
  providers: [RecetteService],
})
export class RecetteModule {}
