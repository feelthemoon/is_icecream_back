import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { Request } from "express";

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
  async findAll(@Param("page") currentPage: number, @Req() request: Request) {
    return await this.stallService.findAll(currentPage, request.query);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  async findStallById(@Param("id") id: string) {
    return await this.stallService.findBy({ id });
  }
}
