import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateShoppingItemDto } from "./dto/create-shoppingItem.dto";
import { ShoppingListItem } from "./entity/shoppingItem.entity";
import { User } from "./user.entity";

@EntityRepository(ShoppingListItem)
export class ShoppingListItemRepository extends Repository<ShoppingListItem> {
  private logger = new Logger('ShoppingListItemRepository');

  async addItem(user:User, createShoppingItemDto: CreateShoppingItemDto):Promise<ShoppingListItem>{
    const { ingredientId, quantity } = createShoppingItemDto
    const item = this.create();
    item.user = user;
    item.ingredientId = ingredientId ;
    item.quantity = quantity;

    try {
        await item.save();
    } catch(error){
        if(error.code == 23505) {
            throw new ConflictException(`Ingredient already assigned for user ${user.username}`);
        } else {
            this.logger.verbose(
                `Problem while saving the Item: ${item.id}, error is : ${error} !`,
              );
            throw new InternalServerErrorException(error);
        }
    }
    this.logger.verbose(`Item ${item.id} is being saved !`);
    delete item.user;
    return item;
  }
}