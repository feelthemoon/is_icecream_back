import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StallEntity, ProductEntity } from "APP/entities";
import { UserModule } from "APP/modules";

import { StallController } from "./stall.controller";
import { StallService } from "./stall.service";

@Module({
  imports: [TypeOrmModule.forFeature([StallEntity, ProductEntity]), UserModule],
  controllers: [StallController],
  providers: [StallService],
})
export class StallModule {}
