import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetteController } from './recettes/recette.controller';
import { RecetteService } from './recettes/recette.service';
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    entities: [],
    synchronize: true,
  }),],
  controllers: [RecetteController],
  providers: [RecetteService],
})
export class AppModule {}
