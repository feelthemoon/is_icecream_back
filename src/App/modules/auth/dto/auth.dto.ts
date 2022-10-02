import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class SigninDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  password: string;
}

export class SignupDto extends SigninDto {
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  first_name: string;
}
