import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinTable,
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
 
    @Column("decimal", { precision: 6, scale: 2 })
    quantity: number;
 
 }