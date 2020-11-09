import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateMarkDto } from "./dto/create-mark.dto";
import { Mark } from "./entity/mark.entity";
import { MarkRepository } from "./mark.repository";
import { User } from "./user.entity";

@Injectable()
export class MarkService {
  private logger = new Logger('markService');

  constructor(
    @InjectRepository(Mark)
    private markRepository: MarkRepository,
  ) {}

  getMark(id:number, user:User){
    return this.markRepository.findOne({
        where: { recipeId: id, user: user },
      });
  }

  createMark(user:User, createMarkDto: CreateMarkDto){
    return this.markRepository.createMark(user, createMarkDto);
  }
}