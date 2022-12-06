import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ProductEntity, StallEntity, ProviderEntity } from ".";

export enum SupplyStatus {
  IN_PROGRESS = "in_progress",
  DONE = "done",
  WAIT_FOR_APPROVE = "wait_for_approve",
  WAIT_FOR_RESPONSE = "wait_for_response",
  DISMISSED = "dismissed",
}

@Entity("supplies")
export class SupplyEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  title?: string;

  @Column({ type: "enum", enum: SupplyStatus })
  supply_status: SupplyStatus;

  @Column({ type: "int" })
  supply_period: number;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(
    () => ProductEntity,
    (product: ProductEntity) => product.supplies,
    {
      cascade: true,
      nullable: true,
    },
  )
  @JoinTable({
    name: "supply_products",
    inverseJoinColumn: { name: "product_id" },
    joinColumn: { name: "supply_id" },
  })
  products: ProductEntity[];

  @ManyToMany(() => StallEntity, (stall: StallEntity) => stall.supplies)
  stalls: StallEntity[];

  @ManyToOne(
    () => ProviderEntity,
    (provider: ProviderEntity) => provider.supplies,
  )
  @JoinColumn({ name: "provider_id" })
  provider: ProviderEntity;
}
