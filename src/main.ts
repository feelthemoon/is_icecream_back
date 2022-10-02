import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import * as cookieParser from "cookie-parser";

import { AppModule } from "APP/app.module";

import { HttpExceptionFilter, TokenExceptionFilter } from "./common/filters";

async function bootstrap() {
  const APP_PORT = process.env.APP_PORT || 8000;

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: "Origin, Content-Type, X-Auth-Token",
    methods: "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new TokenExceptionFilter(), new HttpExceptionFilter());

  await app.listen(APP_PORT, () =>
    Logger.verbose(`APP HAS BEEN STARTED AT PORT ${APP_PORT}`),
  );
}
bootstrap();
