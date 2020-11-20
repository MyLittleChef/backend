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
@Unique(['ingredient','quantity'])
 @Entity()
 export class IngredientQuantity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Ingredient)
    @JoinTable()
    ingredient: Ingredient;
 
    @Column()
    quantity: number;
 
 }