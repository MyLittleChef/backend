import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetteModule } from './recettes/recette.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), RecetteModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
