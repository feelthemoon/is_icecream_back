import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsInt,
  IsOptional,
} from "class-validator";

import { Match } from "@/common/decorators";
import { Roles, UserStatus } from "APP/entities";

export class UserEditDto {
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  second_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  middle_name?: string;

  @IsOptional()
  @IsInt()
  salary?: number;

  @IsOptional()
  @Match([Roles.ADMIN, Roles.MANAGER, Roles.SALLER])
  role?: Roles;

  @IsOptional()
  @Match([
    UserStatus.LEAVE,
    UserStatus.MEDICAL,
    UserStatus.VACATION,
    UserStatus.WORKING,
  ])
  status?: UserStatus;

  @IsOptional()
  stall_id?: string;
}
