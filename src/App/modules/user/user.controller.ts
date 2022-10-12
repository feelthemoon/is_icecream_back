import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

import { GetCurrentUserIdFromAccessToken } from "@/common/decorators";

import { UserService } from "./user.service";

@Controller("api/v1/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  @HttpCode(HttpStatus.OK)
  async getMe(@GetCurrentUserIdFromAccessToken() userId: number) {
    const me = this.userService.findBy("id", userId);
    return me;
  }
}
