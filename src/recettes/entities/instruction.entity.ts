import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import {Recette} from "./recette.entity";
@Unique(['content','recette'])
@Entity()
export class Instruction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recette)
  recette: Recette;

  @Column()
  index: number;

  @Column()
  content: string;

}