import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";

import { Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

@Catch(TokenExpiredError, JsonWebTokenError)
export class TokenExceptionFilter implements ExceptionFilter {
  catch(
    _exception: TokenExpiredError | JsonWebTokenError,
    host: ArgumentsHost,
  ): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(401).json({
      message: [{ type: "common_error", text: "Ошибка авторизации" }],
    });
  }
}
