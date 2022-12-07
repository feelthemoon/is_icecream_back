import { IsString, MaxLength, MinLength, IsArray } from "class-validator";

import { EmployeeEntity } from "APP/entities";

export class CreateStallDto {
  @IsString()
  @MaxLength(255)
  @MinLength(8)
  name: string;

  @IsString()
  @MaxLength(255)
  address: string;

  @IsArray()
  employees: EmployeeEntity[];
}
