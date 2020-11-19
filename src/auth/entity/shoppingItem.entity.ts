import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../user.entity";

@Entity()
@Unique(['ingredientId','user'])
export class ShoppingListItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ingredientId: number;

  @Column()
  quantity: number;

  @ManyToOne(type => User, user => user.shoppingList, {eager: false})
  user: User;
}