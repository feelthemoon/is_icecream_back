import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { SupplyEntity } from ".";

@Entity("providers")
export class ProviderEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", unique: true })
  phone: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SupplyEntity, (supply: SupplyEntity) => supply.provider)
  supplies: SupplyEntity[];
}
