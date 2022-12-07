import { Exclude } from "class-transformer";
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";

import { StallEntity } from "./Stall.entity";

export enum Roles {
  ADMIN = "admin",
  SALLER = "saller",
  MANAGER = "manager",
}

export enum EmployeeStatus {
  WORKING = "working",
  LEAVE = "leave",
  VACATION = "vacation",
  MEDICAL = "medical",
}
@Entity("employees")
export class EmployeeEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", unique: true, nullable: false, length: 255 })
  email: string;

  @Column({ type: "varchar", nullable: false, length: 255, select: false })
  password: string;

  @Column({ type: "varchar", nullable: false, length: 255 })
  first_name: string;

  @Column({ type: "varchar", nullable: true, length: 255 })
  second_name: string;

  @Column({ type: "varchar", nullable: true, length: 255 })
  middle_name: string;

  @Column({ type: "varchar", nullable: true })
  avatar: string;

  @Column({ type: "boolean", nullable: false, default: false })
  confirmed: boolean;

  @Column({ type: "real", nullable: false, default: 0.0 })
  salary: number;

  @Column({ type: "varchar", nullable: true, select: false })
  @Exclude()
  refresh_hash: string;

  @Column({
    type: "enum",
    enum: Roles,
    nullable: false,
    default: Roles.SALLER,
  })
  role: Roles;

  @Column({
    type: "enum",
    enum: EmployeeStatus,
    nullable: false,
    default: EmployeeStatus.LEAVE,
  })
  status: EmployeeStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => StallEntity, (stall: StallEntity) => stall.employees, {
    nullable: true,
  })
  @JoinColumn({ name: "stall_id" })
  stall: StallEntity;
}