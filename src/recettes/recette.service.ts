import { Injectable } from '@nestjs/common';

@Injectable()
export class RecetteService {
  getHello(): string {
    return 'Hello World!';
  }
}
