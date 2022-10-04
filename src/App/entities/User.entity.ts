import { Exclude } from "class-transformer";
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
} from "typeorm";

export enum Roles {
  ADMIN = "admin",
  SALLER = "saller",
  MANAGER = "manager",
  POINT_OWNER = "point_owner",
  CEO = "ceo",
}

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: "varchar", nullable: true, select: false })
  @Exclude()
  refresh_hash: string;

  @Column({ type: "enum", enum: Roles, nullable: false, default: Roles.SALLER })
  role: Roles;

  @CreateDateColumn()
  created_at: Date;
}
