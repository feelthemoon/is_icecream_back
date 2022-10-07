import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Req,
} from "@nestjs/common";

import { Request, Response } from "express";

import { GetCurrentUserIdFromRefreshToken, Public } from "@/common/decorators";
import { RtGuard } from "@/common/guards";

import { AuthService } from "./auth.service";
import { SigninDto, SignupDto } from "./dto/auth.dto";

@Controller("api/v1")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  async signin(@Body() signinDto: SigninDto, @Res() response: Response) {
    const tokens = await this.authService.signin(signinDto);
    response.setHeader(
      "Set-Cookie",
      `Refresh=${tokens.refresh_token}; HttpOnly; Max-Age=30d; SameSite=None; Secure`,
    );
    response.setHeader("Access-Control-Expose-Headers", "Authorization");
    response.setHeader("Authorization", `Bearer ${tokens.access_token}`);
    response.send();
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  async signup(@Body() signupDto: SignupDto) {
    await this.authService.signup(signupDto);
    return;
  }

  @UseGuards(RtGuard)
  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserIdFromRefreshToken() userId: number,
    @Req() request: Request,
  ) {
    const accessToken = await this.authService.refreshToken(
      userId,
      request.cookies["Refresh"],
    );
    return { type: "Bearer", token: accessToken };
  }
}
