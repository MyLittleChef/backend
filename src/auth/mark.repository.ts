import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateMarkDto } from "./dto/create-mark.dto";
import { Mark } from "./entity/mark.entity";
import { User } from "./user.entity";

@EntityRepository(Mark)
export class MarkRepository extends Repository<Mark> {
  private logger = new Logger('MarkRepository');

  async createMark(user:User, createMarkDto: CreateMarkDto){
    const { recipeId, score } = createMarkDto
    const mark = this.create();
    mark.user = user;
    mark.recipeId = recipeId;
    mark.score = score;

    try {
        await mark.save();
    } catch(error){
        if(error.code === 23505) {
            throw new ConflictException('Mark already assigned');
        } else {
            this.logger.verbose(
                `Problem while saving the Mark: ${mark.recipeId}, error is : ${error} !`,
              );
            throw new InternalServerErrorException(error);
        }
    }
    this.logger.verbose(`Mark ${mark.recipeId} is being saved !`);
    delete mark.user;
    return mark;
  }
}