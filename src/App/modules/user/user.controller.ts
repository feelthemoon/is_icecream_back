import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";

import { Request } from "express";

import { GetCurrentUserIdFromAccessToken } from "@/common/decorators";
import { RolesGuard } from "@/common/guards";
import { Roles } from "APP/entities";

import { UserService } from "./user.service";

@Controller("api/v1/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  @HttpCode(HttpStatus.OK)
  async getMe(@GetCurrentUserIdFromAccessToken() userId: number) {
    const me = await this.userService.findBy("id", userId);
    return me;
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @Get("all/:page")
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Param("page") currentPage: number,
    @Req() request: Request,
  ) {
    const users = await this.userService.findAll(currentPage, request.query);
    return users;
  }
}
