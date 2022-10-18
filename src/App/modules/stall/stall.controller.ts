import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";

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
  @Get()
  async findAll() {
    return await this.stallService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  async findStallById(@Param("id") id: number) {
    return await this.stallService.findBy("id", id);
  }
}
