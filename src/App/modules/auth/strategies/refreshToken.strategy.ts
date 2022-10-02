import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { Request } from "express";
import { Strategy } from "passport-jwt";

import { JwtPayload, JwtPayloadWithRt } from "../types";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => req.cookies["Refresh"],
      secretOrKey: config.get<string>("REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req.cookies["Refresh"];

    return {
      ...payload,
      refreshToken,
    };
  }
}
