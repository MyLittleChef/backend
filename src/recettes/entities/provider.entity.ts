import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class Provider extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:string;
    
    @Column()
    name: string;
}