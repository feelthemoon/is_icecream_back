import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsInt,
  IsOptional,
} from "class-validator";

import { Match } from "@/common/decorators";
import { Roles, EmployeeStatus } from "APP/entities";

export class EmployeeEditDto {
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
    EmployeeStatus.LEAVE,
    EmployeeStatus.MEDICAL,
    EmployeeStatus.VACATION,
    EmployeeStatus.WORKING,
  ])
  status?: EmployeeStatus;

  @IsOptional()
  stall_id?: string;
}
