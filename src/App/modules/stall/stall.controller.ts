import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { Request } from "express";
import { Like } from "typeorm";

import { RolesGuard } from "@/common/guards";
import { Roles } from "APP/entities";

import { CreateStallDto } from "./dto/CreateStall.dto";
import { StallService } from "./stall.service";

@Controller("api/v1/stalls")
export class StallController {
  constructor(private readonly stallService: StallService) {}

  @UseGuards(RolesGuard(Roles.ADMIN))
  @HttpCode(HttpStatus.CREATED)
  @Post("create")
  async createStall(@Body() stallData: CreateStallDto) {
    return await this.stallService.create(stallData);
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @HttpCode(HttpStatus.OK)
  @Get("all/:page")
  async findAll(
    @Param("page") currentPage: number,
    @Query("s") searchString: string,
    @Req() request: Request,
  ) {
    if (searchString) {
      delete request.query["s"];
      const { data, total } = await this.stallService.findAll(currentPage, [
        { name: Like(`%${searchString}%`) },
        { address: Like(`%${searchString}%`) },
      ]);

      return { data, total };
    }
    return await this.stallService.findAll(currentPage, request.query);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  async findStallById(@Param("id") id: string) {
    return await this.stallService.findBy({ id });
  }
}
