import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { Request } from "express";

import { GetCurrentUserIdFromAccessToken } from "@/common/decorators";
import { RolesGuard } from "@/common/guards";
import { Roles } from "APP/entities";

import { UserEditDto } from "./dto/UserEdit.dto";
import { UserService } from "./user.service";

@Controller("api/v1/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  @HttpCode(HttpStatus.OK)
  async getMe(@GetCurrentUserIdFromAccessToken() userId: string) {
    const me = await this.userService.findBy({ id: userId });
    return me;
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getUserInfoById(@Param("id") userId: string) {
    const user = await this.userService.findBy({ id: userId });
    return user;
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteUserById(@Param("id") userId: string) {
    await this.userService.deleteUserById(userId);
    return;
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  async updateConfirmed(@Param("id") userId: string) {
    await this.userService.updateField(userId, "confirmed", true);
    return;
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @Patch("/edit/:id")
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param("id") userId: string, @Body() reqBody: UserEditDto) {
    const updatedUser = await this.userService.updateOne(userId, reqBody);
    return updatedUser;
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @Get("all/:page")
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Param("page") currentPage: number,
    @Query("s") searchString: string,
    @Req() request: Request,
  ) {
    if (searchString) {
      delete request.query["s"];
      const [data, total] = await this.userService.searchUsersByFullnameOrEmail(
        searchString,
        currentPage,
        request.query,
      );
      return { data, total };
    }
    const users = await this.userService.findAll(currentPage, request.query);
    return users;
  }
}
