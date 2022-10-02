import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Request } from "express";
import { Observable } from "rxjs";

export class RtGuard extends AuthGuard("jwt-refresh") {
  constructor() {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (request.cookies["Refresh"]) {
      return super.canActivate(context);
    }
    throw new UnauthorizedException({
      message: [{ type: "common_error", text: "Ошибка авторизации" }],
    });
  }
}
