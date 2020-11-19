import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateShoppingItemDto } from "./dto/create-shoppingItem.dto";
import { ShoppingListItem } from "./entity/shoppingItem.entity";
import { ShoppingListItemRepository } from "./shoppingList.repository";
import { User } from "./user.entity";

@Injectable()
export class ShoppingListService {
  private logger = new Logger('ShoppingListService');

  constructor(
    @InjectRepository(ShoppingListItem)
    private shoppingListRepository: ShoppingListItemRepository,
  ) {}

  getShoppingList( user:User):Promise<ShoppingListItem[]>{
    return this.shoppingListRepository.find({
        where: {  user: user }
      });
  }

  addItem(user:User, createShoppingItemDto: CreateShoppingItemDto):Promise<ShoppingListItem>{
    return this.shoppingListRepository.addItem(user, createShoppingItemDto);
  }

  async deleteItem(user:User, itemId:number):Promise<void>{
    const result = await this.shoppingListRepository.delete({ingredientId:itemId, user:user});
    if (result.affected === 0) {
      throw new NotFoundException(`Item with id "${itemId}" not found`);
    } else {
      this.logger.verbose(`Item of id"${itemId}" successfully deleted`);
    }
    return;
  }
}