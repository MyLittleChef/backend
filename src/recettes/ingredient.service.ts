import { Injectable } from '@nestjs/common';

@Injectable()
export class IngredientService {
  getHello(): string {
    return 'Hello World!';
  }
}
