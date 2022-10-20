import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from "@nestjs/common";

import { GetCurrentUserIdFromAccessToken } from "@/common/decorators";

import { UserService } from "./user.service";
import { Roles } from "APP/entities";
import { RolesGuard } from "@/common/guards";
import { log } from "@/common/utils";

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
  async getAllUsers(@Param("page") currentPage: number) {
    const users = await this.userService.findAll(currentPage);
    log(users);
    return users;
  }
}
