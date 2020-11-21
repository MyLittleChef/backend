import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Put,
  UseGuards,
  Logger,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { EditUserDto } from './dto/edit-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Mark } from './entity/mark.entity';
import { MarkService } from './mark.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import { Recette } from 'src/recettes/entities/recette.entity';
import { ShoppingListService } from './shoppingList.service';
import { ShoppingListItem } from './entity/shoppingItem.entity';
import { CreateShoppingItemDto } from './dto/create-shoppingItem.dto';
import {GetConsecutiveRecipesDto} from "../recettes/dto/get-consecutive-recipes-dto";
import {AddSuggestedRecipesDto} from "./dto/add-suggested-recipes.dto";
@Controller('user')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private authService: AuthService, private markService:MarkService, private shoppingListService:ShoppingListService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<void> {
    this.logger.verbose(
      `User with Dto: "${createUserDto}" is trying to Sign Up`,
    );
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; expiresIn: string }> {
    this.logger.verbose(
      `User "${authCredentialsDto.username}" is trying to Sign In`,
    );
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/resetPassword')
  @UseGuards(AuthGuard())
  resetPassword(
    @GetUser() user: User,
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    this.logger.verbose(
      `User "${user}" is trying to Reset Password`,
    );
    return this.authService.resetPassword(user, resetPasswordDto);
  }

  @Get('/details')
  @UseGuards(AuthGuard())
  getUserDetails(@GetUser() user: User): Promise<User> {
    this.logger.verbose(`User "${user.username}" is trying to get Details`);
    return this.authService.getUserDetails(user);
  }

  @Put('/details')
  @UseGuards(AuthGuard())
  editUser(
    @GetUser() user: User,
    @Body(ValidationPipe) editUserDto: EditUserDto,
  ): Promise<User> {
    this.logger.verbose(`User "${user.username}" is trying to modify Details`);
    return this.authService.editUser(user, editUserDto);
  }

  @Get('/starredRecipes')
  @UseGuards(AuthGuard())
  getStarredRecipes(
    @GetUser() user:User
  ): Promise<Recette[]>{
    return this.authService.getStarredRecipes(user);
  }
  @Post('/starredRecipes/:id')
  @UseGuards(AuthGuard())
  addStarredRecipes(
    @GetUser() user:User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Recette[]>{
    return this.authService.addStarredRecipes(user,id);
  }

  @Delete('/starredRecipes/:id')
  @UseGuards(AuthGuard())
  deleteStarredRecipes(
    @GetUser() user:User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void>{
    return this.authService.deleteStarredRecipes(user, id);
  }

  @Get('/suggestedRecipes')
  @UseGuards(AuthGuard())
  getSuggestedRecipes(
    @GetUser() user:User
  ): Promise<Recette[]>{
    return this.authService.getSuggestedRecipes(user);
  }

  @Post(':id/suggestedRecipes')
  addSuggestedRecipes(
    @Body() addSuggestedRecipesDto : AddSuggestedRecipesDto,
    @Param('id', ParseIntPipe) userId: number
  ): Promise<number[]>{
    return this.authService.addSuggestedRecipes(userId, addSuggestedRecipesDto);
  }

  @Delete('/suggestedRecipes/:id')
  @UseGuards(AuthGuard())
  deleteSuggestedRecipes(
    @GetUser() user:User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void>{
    return this.authService.deleteSuggestedRecipes(user, id);
  }

  @Get('/toDoRecipes')
  @UseGuards(AuthGuard())
  getToDoRecipes(
    @GetUser() user:User
  ): Promise<Recette[]>{
    return this.authService.getToDoRecipes(user);
  }

  @Post('/toDoRecipes/:id')
  @UseGuards(AuthGuard())
  addToDoRecipes(
    @GetUser() user:User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Recette[]>{
    return this.authService.addToDoRecipes(user,id);
  }
  @Delete('/toDoRecipes/:id')
  @UseGuards(AuthGuard())
  deleteToDoRecipes(
    @GetUser() user:User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void>{
    return this.authService.deleteToDoRecipes(user, id);
  }

  @Get('/doneRecipes')
  @UseGuards(AuthGuard())
  getDoneRecipes(
    @GetUser() user:User
  ): Promise<Recette[]>{
    return this.authService.getDoneRecipes(user);
  }
  @Post('/doneRecipes/:id')
  @UseGuards(AuthGuard())
  addDoneRecipes(
    @GetUser() user:User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Recette[]>{
    return this.authService.addDoneRecipes(user,id);
  }

  @Delete('/doneRecipes/:id')
  @UseGuards(AuthGuard())
  deleteDoneRecipes(
    @GetUser() user:User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void>{
    return this.authService.deleteDoneRecipes(user, id);
  }

  @Get('/mark/:id')
  @UseGuards(AuthGuard())
  getMark(
    @GetUser() user:User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Mark> {
    return this.markService.getMark(id, user);
  }

  @Post('/mark')
  @UseGuards(AuthGuard())
  createMark(
      @GetUser() user:User,
      @Body(ValidationPipe) createMarkDto: CreateMarkDto,
  ): Promise<Mark>{
    return this.markService.createMark(user,createMarkDto);
  }

  @Get('/toRecalculate')
  getToRecalculateUsers():Promise<User[]>{
    return this.authService.getToRecalculateUsers();
  }

  @Post('/calculated/:id')
  toRecalculateFalse(
    @Param('id', ParseIntPipe) userId:number
  ):Promise<void>{
    return this.authService.toRecalculateFalse(userId);
  }

  @Get('/shoppingList')
  @UseGuards(AuthGuard())
  getShoppingList(
    @GetUser() user:User
  ):Promise<ShoppingListItem[]>{
    return this.shoppingListService.getShoppingList(user);
  }

  @Post('/shoppingList')
  @UseGuards(AuthGuard())
  addShoppingItem(
    @GetUser() user:User,
    @Body(ValidationPipe) createShoppingItemDto:CreateShoppingItemDto
  ):Promise<ShoppingListItem>{
    return this.shoppingListService.addItem(user, createShoppingItemDto);
  }

  @Delete('shoppingList/:id')
  @UseGuards(AuthGuard())
  deleteShoppingItem(
    @GetUser() user:User,
    @Param('id', ParseIntPipe) itemId:number
  ):Promise<void>{
    return this.shoppingListService.deleteItem(user, itemId);
  }

}
