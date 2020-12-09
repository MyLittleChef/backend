import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Recette} from "./recette.entity";

@Entity()
export class Instruction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Recette)
    recette: Recette;

    @Column()
    content: string;

    @Column()
    index: number;

}