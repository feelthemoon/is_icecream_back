import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Request } from "express";

import { Roles } from "APP/entities";
import { UserService } from "APP/modules/user/user.service";

export const RolesGuard = (role: Roles): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
      private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();

      const accessToken = request.headers.authorization.split(" ")[1];

      const userId = this.jwtService.decode(accessToken).sub;

      const userRoles = (await this.userService.findBy("id", userId)).role;
      return userRoles?.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
};
