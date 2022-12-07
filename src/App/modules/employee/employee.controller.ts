import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { Request } from "express";

import { GetCurrentEmployeeIdFromAccessToken } from "@/common/decorators";
import { RolesGuard } from "@/common/guards";
import { Roles } from "APP/entities";

import { EmployeeEditDto } from "./dto/EmployeeEdit.dto";
import { EmployeeService } from "./employee.service";

@Controller("api/v1/employees")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get("me")
  @HttpCode(HttpStatus.OK)
  async getMe(@GetCurrentEmployeeIdFromAccessToken() userId: string) {
    const me = await this.employeeService.findBy({ id: userId });
    return me;
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getEmployeeInfoById(@Param("id") employeeId: string) {
    const employee = await this.employeeService.findBy({ id: employeeId });
    return employee;
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteEmployeeById(@Param("id") employeeId: string) {
    await this.employeeService.deleteEmployeeById(employeeId);
    return;
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  async updateConfirmed(@Param("id") employeeId: string) {
    await this.employeeService.updateField(employeeId, "confirmed", true);
    return;
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @Patch("/edit/:id")
  @HttpCode(HttpStatus.OK)
  async updateEmployee(
    @Param("id") employeeId: string,
    @Body() reqBody: EmployeeEditDto,
  ) {
    const updatedEmployee = await this.employeeService.updateOne(
      employeeId,
      reqBody,
    );
    return updatedEmployee;
  }

  @UseGuards(RolesGuard(Roles.ADMIN))
  @Get("all/:page")
  @HttpCode(HttpStatus.OK)
  async getAllEmployees(
    @Param("page") currentPage: number,
    @Query("s") searchString: string,
    @Req() request: Request,
  ) {
    if (searchString) {
      delete request.query["s"];
      const [data, total] =
        await this.employeeService.searchEmployeesByFullnameOrEmail(
          searchString,
          currentPage,
          request.query,
        );
      return { data, total };
    }
    const employees = await this.employeeService.findAll(
      currentPage,
      request.query,
    );
    return employees;
  }
}
