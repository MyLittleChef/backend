import {
   BaseEntity,
   Entity,
   PrimaryGeneratedColumn,
   Column,
   Unique,
} from 'typeorm';
@Entity()
@Unique(['nom','uniteMesure'])
export class Ingredient extends BaseEntity {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   nom: string;

   @Column()
   uniteMesure: string;

}
