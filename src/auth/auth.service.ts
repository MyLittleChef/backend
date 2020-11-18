import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { randomBytes } from 'crypto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import * as config from 'config';
import { Recette } from 'src/recettes/entities/recette.entity';
@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    return this.userRepository.signUp(createUserDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; expiresIn: string }> {
    const jwtConfig = config.get('jwt');
    const expiresIn = jwtConfig.expiresIn;
    const username = await this.userRepository.validationPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );
    return { accessToken, expiresIn };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const resetTokenValue = randomBytes(20).toString('hex');
    const resetTokenExpiration = String(Date.now() + 3600000);
    return this.userRepository.resetPassword(
      resetPasswordDto,
      resetTokenValue,
      resetTokenExpiration,
    );
  }
  async editUser(user: User, editUserDto: EditUserDto): Promise<User> {
    return this.userRepository.editUser(user, editUserDto);
  }
  async getUserDetails(user: User): Promise<User> {
    return this.userRepository.getUserDetails(user);
  }

  async getToDoRecipes(user:User):Promise<Recette[]>{
    const getUser = await this.userRepository.findOne({ relations: ["toDoRecipes"], where: { id: user.id}  });
    return getUser.toDoRecipes;
  }

  async addToDoRecipes(user:User, recipeId:number):Promise<Recette[]>{
    return this.userRepository.addToDoRecipes(user, recipeId);
  }

  async deleteToDoRecipes(user:User, recipeId: number): Promise<void> {
    return this.userRepository.deleteToDoRecipes(user,recipeId);
  }

  async getStarredRecipes(user:User):Promise<Recette[]>{
    const getUser = await this.userRepository.findOne({ relations: ["starredRecipes"], where: { id: user.id}  });
    return getUser.starredRecipes;
  }
  async addStarredRecipes(user:User, recipeId:number):Promise<Recette[]>{
    return this.userRepository.addStarredRecipes(user, recipeId);
  }
  async deleteStarredRecipes(user:User, recipeId: number): Promise<void> {
    return this.userRepository.deleteStarredRecipes(user, recipeId);
  }

  async getDoneRecipes(user:User):Promise<Recette[]>{
    const getUser = await this.userRepository.findOne({ relations: ["doneRecipes"], where: { id: user.id} });
    return getUser.doneRecipes;
  }
  async addDoneRecipes(user:User, recipeId:number):Promise<Recette[]>{
    return this.userRepository.addDoneRecipes(user, recipeId);
  }
  async deleteDoneRecipes(user:User, recipeId: number): Promise<void> {
    return this.userRepository.deleteDoneRecipes(user, recipeId);
  }

  async getSuggestedRecipes(user:User):Promise<Recette[]>{
    const getUser = await this.userRepository.findOne({ relations: ["suggestedRecipes"], where: { id: user.id} });
    return getUser.suggestedRecipes;
  }
  async addSuggestedRecipes(user:User, recipeId:number):Promise<Recette[]>{
    return this.userRepository.addSuggestedRecipes(user, recipeId);
  }
  async deleteSuggestedRecipes(user:User, recipeId: number): Promise<void> {
    return this.userRepository.deleteSuggestedRecipes(user, recipeId);
  }

  async toRecalculateFalse(user: User):Promise<void>{
    return this.userRepository.toRecalculateFalse(user);
  }
  async getToRecalculateUsers():Promise<User[]>{
    const users:User[] = await this.userRepository.find({where: {toRecalculate: true}});
    users.map(user => {
      delete user.password;
      delete user.salt;
      delete user.resetPasswordExpires;
      delete user.allergies;
      delete user.cookingFrequence;
      delete user.diets;
      delete user.doneRecipes;
      delete user.marks;
      delete user.shoppingList;
      delete user.suggestedRecipes
      delete user.toDoRecipes;
      delete user.starredRecipes;
      delete user.resetPasswordToken;
    })
    return users;
  }

}
