import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RedisModule } from "nestjs-redis";

import { AtGuard } from "@/common/guards";

import {
  UserEntity,
  ProductEntity,
  StallEntity,
  SupplyEntity,
  ProviderEntity,
} from "./entities";
import { AuthModule, UserModule, StallModule } from "./modules";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      port: parseInt(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      host: process.env.PG_HOST,
      entities: [
        UserEntity,
        ProductEntity,
        StallEntity,
        SupplyEntity,
        ProviderEntity,
      ],
      synchronize: true,
      logger: "file",
      logging: true,
      cache: {
        duration: 1000 * 60,
      },
    }),
    RedisModule.register({
      name: "revoked_tokens",
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      db: parseInt(process.env.REDIS_DB),
    }),
    AuthModule,
    UserModule,
    StallModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
