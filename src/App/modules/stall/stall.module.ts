import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StallEntity, ProductEntity } from "APP/entities";
import { EmployeeModule } from "APP/modules";

import { StallController } from "./stall.controller";
import { StallService } from "./stall.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([StallEntity, ProductEntity]),
    EmployeeModule,
  ],
  controllers: [StallController],
  providers: [StallService],
})
export class StallModule {}
