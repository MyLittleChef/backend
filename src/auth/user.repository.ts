import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EditUserDto } from './dto/edit-user.dto';
import sgMail = require('@sendgrid/mail');
import { CookingFrequence } from './entity/cookingFrequence.enum';
import { Recette } from 'src/recettes/entities/recette.entity';
import { SSL_OP_TLS_BLOCK_PADDING_BUG } from 'constants';
sgMail.setApiKey(process.env.SENDGRID_KEY);

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('AuthService');
  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const { username, password, allergies, diets, cookingFrequence } = createUserDto;
    const getArrayFromStringIfNeeded = function(input) {
      return Array.isArray(input) == false ? new Array(input.toString()) : input;
    };
    const user = this.create();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    
    user.resetPasswordToken = '';
    user.resetPasswordExpires = '';

    user.allergies = allergies ? getArrayFromStringIfNeeded(allergies) : [];
    user.diets = diets ? getArrayFromStringIfNeeded(diets) : [];
    user.cookingFrequence = cookingFrequence ? cookingFrequence:CookingFrequence.CASUAL;

    try {
      await user.save();
    } catch (error) {
      if (error.code === 23505) {
        //Duplicate Username
        throw new ConflictException('Username already exists');
      } else {
        this.logger.verbose(
          `Problem while saving the User: ${user.username}, error is : ${error} !`,
        );

        throw new InternalServerErrorException(error);
      }
    }
    this.logger.verbose(`User ${user.username} is being saved !`);
  }

  async validationPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    resetTokenValue: string,
    resetTokenExpiration: string,
  ): Promise<void> {
    const { username } = resetPasswordDto;
    const user = await this.findOne({ username });

    user.resetPasswordToken = resetTokenValue;
    user.resetPasswordExpires = resetTokenExpiration;

    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    try {
      sgMail.send({
        from: 'pictalk.mail@gmail.com',
        to: 'asidiras.csi@gmail.com',
        subject: 'Your Password Reset Demand',
        text: 'This is a test email',
        html: '<p>This is a test email</p>',
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUserDetails(user: User): Promise<User> {
    delete user.username;
    delete user.password;
    delete user.salt;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;

    const recipes = await this.find({ relations: ["starredRecipes"] });
    console.log(recipes);
    return user;
  }
  async editUser(user: User, editUserDto: EditUserDto): Promise<User> {
    const { username, diets, password, allergies, cookingFrequence, toDoRecipes, starredRecipes, doneRecipes, shoppingList } = editUserDto;
    const getArrayFromStringIfNeeded = function(input) {
      return Array.isArray(input) == false ? new Array(input.toString()) : input;
    };
    if (username) {
      user.username = username;
    } 
    username ? user.username=username : void 0;
    if (password) {
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, user.salt);
    }
    diets ? user.diets=getArrayFromStringIfNeeded(diets) : void 0;
    allergies ? user.allergies=getArrayFromStringIfNeeded(allergies) : void 0;
    shoppingList ? user.shoppingList=shoppingList.map(ingredientId => ({ id: ingredientId } as any)) : void 0;
    cookingFrequence ? user.cookingFrequence=cookingFrequence : void 0;
    toDoRecipes ? user.toDoRecipes = toDoRecipes.map(recipeId => ({ id: recipeId } as any)) : void 0;
    starredRecipes ? user.starredRecipes = starredRecipes.map(recipeId => ({ id: recipeId } as any)) : void 0;
    doneRecipes ? user.doneRecipes = doneRecipes.map(recipeId => ({ id: recipeId } as any)) : void 0;
    
    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    delete user.username;
    delete user.password;
    delete user.salt;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;
    return user;
  }

  async addToDoRecipes(user:User, recipeId:number):Promise<Recette[]>{
    const getUser = await this.findOne({relations: ["toDoRecipes"],where: {id: user.id}});
    getUser.toDoRecipes.push({ id: recipeId } as any);

    try{
      getUser.save()
    } catch (error) {
      this.logger.verbose(
        `Problem while saving the User: ${getUser.id}, error is : ${error} !`,
      );
      throw new InternalServerErrorException(error);
      }
      return getUser.toDoRecipes;
  }

  async deleteToDoRecipes(user:User, recipeId:number):Promise<void>{
    const getUser = await this.findOne({relations: ["toDoRecipes"],where: {id: user.id}});
    const deletedRecipeIndex = getUser.toDoRecipes.findIndex(
      toDoRecipe => toDoRecipe.id === recipeId
    );
    getUser.toDoRecipes.splice(deletedRecipeIndex, 1);
    
    try {
      getUser.save();
    } catch (error) {
      this.logger.verbose(
        `Problem while saving the User: ${getUser.id}, error is : ${error} !`,
      );
      throw new InternalServerErrorException(error);
      }
      return;
    }

    async addStarredRecipes(user:User, recipeId:number):Promise<Recette[]>{
      const getUser = await this.findOne({relations: ["starredRecipes"],where: {id: user.id}});
      getUser.starredRecipes.push({ id: recipeId } as any);
  
      try{
        getUser.save()
      } catch (error) {
        this.logger.verbose(
          `Problem while saving the User: ${getUser.id}, error is : ${error} !`,
        );
        throw new InternalServerErrorException(error);
        }
        console.log(getUser);
        return getUser.starredRecipes;
    }
  
  async deleteStarredRecipes(user:User, recipeId:number):Promise<void>{
    const getUser = await this.findOne({relations: ["starredRecipes"],where: {id: user.id}});
    const deletedRecipeIndex = getUser.starredRecipes.findIndex(
      toDoRecipe => toDoRecipe.id === recipeId
    );
    getUser.starredRecipes.splice(deletedRecipeIndex, 1);
    
    try {
      getUser.save();
    } catch (error) {
      this.logger.verbose(
        `Problem while saving the User: ${getUser.id}, error is : ${error} !`,
      );
      throw new InternalServerErrorException(error);
      }
      return;
    }

    async addDoneRecipes(user:User, recipeId:number):Promise<Recette[]>{
      const getUser = await this.findOne({relations: ["doneRecipes"],where: {id: user.id}});
      getUser.doneRecipes.push({ id: recipeId } as any);
      try{
        getUser.save()
      } catch (error) {
        this.logger.verbose(
          `Problem while saving the User: ${getUser.id}, error is : ${error} !`,
        );
        throw new InternalServerErrorException(error);
        }
        return getUser.doneRecipes;
    }
    
  async deleteDoneRecipes(user:User, recipeId:number):Promise<void>{
    const getUser = await this.findOne({relations: ["doneRecipes"],where: {id: user.id}});
    const deletedRecipeIndex = getUser.doneRecipes.findIndex(
      toDoRecipe => toDoRecipe.id === recipeId
    );
    getUser.doneRecipes.splice(deletedRecipeIndex, 1);
    
    try {
      getUser.save();
    } catch (error) {
      this.logger.verbose(
        `Problem while saving the User: ${getUser.id}, error is : ${error} !`,
      );
      throw new InternalServerErrorException(error);
      }
      return;
    }

    async addSuggestedRecipes(user:User, recipeId:number):Promise<Recette[]>{
      const getUser = await this.findOne({relations: ["suggestedRecipes"],where: {id: user.id}});
      getUser.suggestedRecipes.push({ id: recipeId } as any);
  
      try{
        getUser.save()
      } catch (error) {
        this.logger.verbose(
          `Problem while saving the User: ${getUser.id}, error is : ${error} !`,
        );
        throw new InternalServerErrorException(error);
        }
        console.log(getUser);
        return getUser.suggestedRecipes;
    }
  
  async deleteSuggestedRecipes(user:User, recipeId:number):Promise<void>{
    const getUser = await this.findOne({relations: ["suggestedRecipes"],where: {id: user.id}});
    const deletedRecipeIndex = getUser.suggestedRecipes.findIndex(
      suggestedRecipes => suggestedRecipes.id === recipeId
    );
    getUser.suggestedRecipes.splice(deletedRecipeIndex, 1);
    
    try {
      getUser.save();
    } catch (error) {
      this.logger.verbose(
        `Problem while saving the User: ${getUser.id}, error is : ${error} !`,
      );
      throw new InternalServerErrorException(error);
      }
      return;
    }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
