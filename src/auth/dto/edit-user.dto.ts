import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { CookingFrequence } from '../entity/cookingFrequence.enum';

export class EditUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(254)
  @Matches(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    { message: 'Not a valid email address' },
  )
  username: string;

  @IsOptional()
  diets: string[];

  @IsOptional()
  allergies: string[];

  @IsOptional()
  @IsString()
  cookingFrequence: CookingFrequence;

  @IsOptional()
  toDoRecipes: string[];

  @IsOptional()
  starredRecipes: string[];

  @IsOptional()
  doneRecipes: string[];
  
  @IsOptional()
  shoppingList: string[];

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
