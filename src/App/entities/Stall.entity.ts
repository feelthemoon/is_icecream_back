import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
  UpdateDateColumn,
} from "typeorm";

import { ProductEntity, SupplyEntity, EmployeeEntity } from ".";

@Entity("stalls")
export class StallEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false, length: 255, unique: true })
  name: string;

  @Column({ type: "varchar", nullable: false, length: 255 })
  address: string;

  @Column({ type: "varchar", nullable: true })
  thumb: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => EmployeeEntity, (user: EmployeeEntity) => user.stall, {
    cascade: true,
  })
  employees: EmployeeEntity[];

  @ManyToMany(() => SupplyEntity, (supply: SupplyEntity) => supply.stalls, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({
    name: "stall_supplies",
    inverseJoinColumn: { name: "supply_id" },
    joinColumn: { name: "stall_id" },
  })
  supplies: StallEntity[];

  @ManyToMany(() => ProductEntity, (product: ProductEntity) => product.stalls, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({
    name: "stall_products",
    inverseJoinColumn: { name: "product_id" },
    joinColumn: { name: "stall_id" },
  })
  products: ProductEntity[];
}
