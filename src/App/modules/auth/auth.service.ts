import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { compare, hash } from "bcrypt";
import { RedisService } from "nestjs-redis";

import { EmployeeService } from "APP/modules/employee/employee.service";

import { SigninDto, SignupDto } from "./dto/auth.dto";
import { JwtPayload, Tokens } from "./types";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly userService: EmployeeService,
    private readonly redisService: RedisService,
  ) {}

  async signin(signDto: SigninDto): Promise<Tokens> {
    const user = await this.userService.findBy(
      { email: signDto.email },
      "password",
    );

    if (!user) {
      throw new BadRequestException({
        message: [
          { type: "invalid_data", text: "Неверный email и/или пароль" },
        ],
      });
    }

    const isPasswordCompared = await compare(signDto.password, user.password);

    if (!isPasswordCompared) {
      throw new BadRequestException({
        message: [
          { type: "invalid_data", text: "Неверный email и/или пароль" },
        ],
      });
    }

    if (!user.confirmed) {
      throw new ForbiddenException({
        message: [
          {
            type: "common_error",
            text: "Дождитесь подтверждения вашего профиля!",
          },
        ],
      });
    }

    const tokens = await this.getTokens(user.id);
    const refreshHash = await hash(tokens.refresh_token, 10);
    await this.userService.updateField(user.id, "refresh_hash", refreshHash);

    return tokens;
  }

  async signup(signupDto: SignupDto): Promise<void> {
    const isEmailInUse = await this.userService.findBy({
      email: signupDto.email,
    });
    if (isEmailInUse)
      throw new BadRequestException({
        message: [
          {
            type: "invalid_data_email",
            text: "Пользователь с таким email уже существует",
          },
        ],
      });

    const hashPassword = await hash(signupDto.password, 10);

    await this.userService.create({
      ...signupDto,
      password: hashPassword,
    });
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findBy({ id: userId }, "refresh_hash");
    if (!user?.refresh_hash)
      throw new UnauthorizedException({
        message: [{ type: "common_error", text: "Ошибка авторизации" }],
      });

    const isRefreshTokensCompared = await compare(
      refreshToken,
      user.refresh_hash,
    );
    if (!isRefreshTokensCompared)
      throw new UnauthorizedException({
        message: [{ type: "common_error", text: "Ошибка авторизации" }],
      });

    this.jwtService.verify(refreshToken, {
      secret: this.config.get<string>("REFRESH_TOKEN_SECRET"),
    });
    return this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.config.get<string>("ACCESS_TOKEN_SECRET"),
        expiresIn: this.config.get<string>("ACCESS_TOKEN_EXPIRATION"),
      },
    );
  }
  async getTokens(userId: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>("ACCESS_TOKEN_SECRET"),
        expiresIn: this.config.get<string>("ACCESS_TOKEN_EXPIRATION"),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>("REFRESH_TOKEN_SECRET"),
        expiresIn: this.config.get<string>("REFRESH_TOKEN_EXPIRATION"),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async logout(userId: string, accessToken: string): Promise<boolean> {
    const redisClient = this.redisService.getClient("revoked_tokens");
    await redisClient.append(accessToken, "true");

    await this.userService.updateField(userId, "refresh_hash", null);
    return true;
  }
}
