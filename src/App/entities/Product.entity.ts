import { SupplyEntity, StallEntity } from ".";
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  ManyToMany,
  UpdateDateColumn,
} from "typeorm";

export enum ProductTypes {
  ICECREAM = "icecream",
  DRINKS = "drinks",
  STREETFOOD = "streetfood",
  OTHER = "other",
}

@Entity("products")
export class ProductEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false, length: 255 })
  name: string;

  @Column({ type: "enum", enum: ProductTypes, nullable: false })
  type: string;

  @Column({ type: "int", nullable: true })
  weight: number;

  @Column({ type: "varchar", nullable: false, length: 255 })
  producer: string;

  @Column({ type: "real", nullable: false })
  price: number;

  @Column({ type: "date", nullable: false })
  expiration_date: Date;

  @Column({ type: "date", nullable: false })
  manufacture_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => StallEntity, (stall: StallEntity) => stall.products)
  stalls: StallEntity[];

  @ManyToMany(() => SupplyEntity, (supply: SupplyEntity) => supply.products)
  supplies: SupplyEntity[];
}
