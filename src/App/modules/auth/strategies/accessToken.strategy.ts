import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { Request } from "express";
import { RedisService } from "nestjs-redis";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JwtPayload } from "../types";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly _config: ConfigService,
    private readonly _redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _config.get<string>("ACCESS_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const redisClient = this._redisService.getClient("revoked_tokens");
    const isTokenRevoked = await redisClient.get(req.headers.authorization);
    if (isTokenRevoked) {
      throw new UnauthorizedException({
        message: [{ type: "common_error", text: "Ошибка авторизации" }],
      });
    }
    return payload;
  }
}
