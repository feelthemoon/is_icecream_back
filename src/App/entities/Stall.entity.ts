import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from "typeorm";

import { ProductEntity } from "./Product.entity";
import { UserEntity } from "./User.entity";

@Entity("stalls")
export class StallEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false, length: 255 })
  name: string;

  @Column({ type: "varchar", nullable: false, length: 255 })
  address: string;

  @Column({ type: "varchar", nullable: true })
  thumb: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => UserEntity, (user: UserEntity) => user.stall, {
    cascade: true,
  })
  employees: UserEntity[];

  @ManyToMany(() => ProductEntity, (product: ProductEntity) => product.stalls, {
    cascade: true,
  })
  @JoinTable({
    name: "stall_products",
    inverseJoinColumn: { name: "product_id" },
    joinColumn: { name: "stall_id" },
  })
  products: ProductEntity[];
}
