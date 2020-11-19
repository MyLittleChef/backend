import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import { MarkService } from './mark.service';
import { MarkRepository } from './mark.repository';
import { ShoppingListItemRepository } from './shoppingList.repository';
import { ShoppingListService } from './shoppingList.service';

const jwtConfig = config.get('jwt');
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([MarkRepository]),
    TypeOrmModule.forFeature([ShoppingListItemRepository])
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    MarkService,
    ShoppingListService
  ],
  exports: [
    JwtStrategy,
    PassportModule,
  ]
})
export class AuthModule {}
