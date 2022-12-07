import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Request } from "express";

export const GetCurrentEmployeeIdFromRefreshToken = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request: Request = context.switchToHttp().getRequest();
    const jwt = new JwtService();
    return jwt.decode(request.cookies["Refresh"])?.sub;
  },
);

export const GetCurrentEmployeeIdFromAccessToken = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request: Request = context.switchToHttp().getRequest();
    const jwt = new JwtService();
    return jwt.decode(request.headers.authorization.split(" ")[1])?.sub;
  },
);
