import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinTable,
    ManyToOne,
 } from 'typeorm';
import { Ingredient } from './ingredient.entity';

// TODO : UNIQUE 

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