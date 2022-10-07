import { UserService } from "./user.service";
import { GetCurrentUserIdFromAccessToken } from "@/common/decorators";
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

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
