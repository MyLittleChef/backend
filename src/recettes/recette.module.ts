import { Module } from '@nestjs/common';
import { RecetteController } from './recette.controller';
import { RecetteService } from './recette.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetteRepository } from './recette.repository'
@Module({
  imports: [TypeOrmModule.forFeature([RecetteRepository])],
  controllers: [RecetteController],
  providers: [RecetteService],
})
export class RecetteModule {}
