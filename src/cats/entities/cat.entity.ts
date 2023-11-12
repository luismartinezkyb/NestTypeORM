import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  race: string;
  @DeleteDateColumn()
  deletedAt: Date;
}
