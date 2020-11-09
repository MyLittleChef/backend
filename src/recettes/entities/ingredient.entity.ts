import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';
@Entity()
export class Ingredient extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    uniteMesure: string;

}