import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateMarkDto } from "./dto/create-mark.dto";
import { GetMarkDto } from "./dto/getMark.dto";
import { GetRecipeMarksDto } from "./dto/getRecipeMarks.dto";
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
    const mark = await this.markRepository.findOne({
      where: { recipe: id, user: user },
    });

    Object.assign(
      mark,
      {"id" : mark.recipe.id }
    )
    delete mark.recipe
    return mark;
  }

  async getRecipeMarks(user:User):Promise<Mark[]>{
    const recipeMarks = await this.markRepository.find({
      where: { user: user },
    });

    recipeMarks.forEach( mark =>
      Object.assign(
        mark,
        {"id" : mark.recipe.id }
      )
    )
    recipeMarks.forEach( mark =>
      delete mark.recipe
    )

    return recipeMarks;
  }
  async getRecipeMarksApi(getRecipeMarksDto:GetRecipeMarksDto):Promise<Mark[]>{
    if (getRecipeMarksDto.apiKey !== "c8g6s2e375bf14e47ae411c4ab6751449") {
      throw new ForbiddenException('ApiKey not recognized');
    }
    const recipeMarks = await this.markRepository.find({
      where: { user: getRecipeMarksDto.userId },
    });

    recipeMarks.forEach( mark =>
      Object.assign(
        mark,
        {"id" : mark.recipe.id }
      )
    )
    recipeMarks.forEach( mark =>
      delete mark.recipe
    )

    return recipeMarks;
  }

  createMark(user:User, createMarkDto: CreateMarkDto):Promise<Mark>{
    return this.markRepository.createMark(user, createMarkDto);
  }

  editMark(user:User, createMarkDto: CreateMarkDto):Promise<Mark>{
    return this.markRepository.editMark(user, createMarkDto);
  }
}