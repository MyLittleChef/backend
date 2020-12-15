import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Unique,
 } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import {Recette} from "./recette.entity";
@Unique(['ingredient','quantity'])
 @Entity()
 export class IngredientQuantity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Ingredient)
    ingredient: Ingredient;

    @ManyToOne(() => Recette)
    recette: Recette;
 
    @Column("decimal", { precision: 7, scale: 3 })
    quantity: number;
 
 }