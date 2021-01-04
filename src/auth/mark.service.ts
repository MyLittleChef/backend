import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateMarkDto } from "./dto/create-mark.dto";
import { GetMarkDto } from "./dto/getMark.dto";
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

  getMark(id:number, getMarkDto:GetMarkDto):Promise<Mark>{
    if (getMarkDto.apiKey !== "c8g6s2e375bf14e47ae411c4ab6751449") {
      throw new ForbiddenException('ApiKey not recognized');
  }
    return this.markRepository.findOne({
        where: { recipe: id, user: getMarkDto.userId },
      });
  }

  async getRecipeMark(user:User, id:number):Promise<Mark>{
    return this.markRepository.findOne({
      where: { recipe: id, user: user },
    });
  }

  async getRecipeMarks(user:User):Promise<Mark[]>{
    return this.markRepository.find({
      where: { user: user },
    });
  }

  createMark(user:User, createMarkDto: CreateMarkDto):Promise<Mark>{
    return this.markRepository.createMark(user, createMarkDto);
  }

  editMark(user:User, createMarkDto: CreateMarkDto):Promise<Mark>{
    return this.markRepository.editMark(user, createMarkDto);
  }
}