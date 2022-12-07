import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { hash } from "bcrypt";
import { FindOptionsWhere, IsNull, Repository } from "typeorm";

import { EmployeeEntity } from "APP/entities";
import { SignupDto } from "APP/modules/auth/dto/auth.dto";

import { EmployeeEditDto } from "./dto/EmployeeEdit.dto";
import { AddSelectType, UpdateFieldType } from "./types";

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
  ) {}

  create(user: SignupDto): Promise<EmployeeEntity> {
    return this.employeeRepository.save({
      ...user,
      avatar: `gradient-${Math.floor(Math.random() * 8 + 1)}`,
    });
  }

  findBy(
    searchObject:
      | FindOptionsWhere<EmployeeEntity>
      | FindOptionsWhere<EmployeeEntity>[],
    addSelectField?: AddSelectType,
  ): Promise<EmployeeEntity | null> {
    if (addSelectField) {
      return this.employeeRepository
        .createQueryBuilder("employees")
        .addSelect(`employees.${addSelectField}`)
        .where(searchObject)
        .leftJoinAndSelect("employees.stall", "stall")
        .getOne();
    }
    return this.employeeRepository.findOne({
      where: searchObject,
      relations: { stall: true },
    });
  }

  async findAll(page: number, filters?: any) {
    const perPage = 15;
    const skip = perPage * page - perPage;

    const updatedFilters = {};

    Object.keys(filters).forEach((filterName) => {
      if (filters[filterName] === "null") {
        updatedFilters[filterName] = IsNull();
      } else {
        updatedFilters[filterName] = filters[filterName];
      }
    });
    const [data, total] = await this.employeeRepository.findAndCount({
      where: updatedFilters,
      relations: { stall: true },
      order: {
        created_at: {
          direction: "DESC",
        },
      },
      take: perPage,
      skip,
    });
    return { data, total };
  }

  findAllBy(
    searchObject:
      | FindOptionsWhere<EmployeeEntity>
      | FindOptionsWhere<EmployeeEntity>[],
  ): Promise<EmployeeEntity[]> {
    return this.employeeRepository.find({
      where: searchObject,
      cache: 1000 * 60 * 60,
    });
  }

  async updateField(
    id: string,
    updateField: UpdateFieldType,
    value: any,
  ): Promise<EmployeeEntity | null> {
    const employee = await this.findBy({ id }, "password");
    if (!employee) {
      throw new NotFoundException({
        message: [{ type: "common_error", text: "Пользователь не найден" }],
      });
    }
    if (updateField === "password") {
      employee.password = await hash(value, 10);
      return this.employeeRepository.save(employee);
    }
    employee[updateField] = value;
    return this.employeeRepository.save(employee);
  }

  async updateOne(
    id: string,
    updateDto: EmployeeEditDto,
  ): Promise<EmployeeEntity | null> {
    const employee = await this.findBy({ id });
    if (!employee) {
      throw new NotFoundException({
        message: [{ type: "common_error", text: "Пользователь не найден" }],
      });
    }
    if (updateDto["email"]) {
      const duplicateEmail = await this.findBy({ email: updateDto["email"] });
      if (duplicateEmail)
        throw new BadRequestException({
          message: [
            { type: "invalid_data_email", text: "Этот емайл уже занят" },
          ],
        });
    }
    Object.keys(updateDto).forEach(async (field) => {
      employee[field] = updateDto[field];
    });
    return this.employeeRepository.save(employee);
  }

  searchEmployeesByFullnameOrEmail(
    value: string,
    page: number,
    filters?:
      | FindOptionsWhere<EmployeeEntity>
      | FindOptionsWhere<EmployeeEntity>[],
  ) {
    const perPage = 15;
    const skip = perPage * page - perPage;

    const fullname = value.replace(/\s/g, "");
    const updatedFilters = {};

    Object.keys(filters).forEach((filterName) => {
      if (filters[filterName] === "null") {
        updatedFilters[filterName] = IsNull();
      } else {
        updatedFilters[filterName] = filters[filterName];
      }
    });

    return this.employeeRepository
      .createQueryBuilder("employees")
      .leftJoinAndSelect("employees.stall", "stalls")
      .where(
        `(CONCAT(employees.first_name, employees.second_name, employees.middle_name) LIKE :fullname
         OR CONCAT(employees.first_name, employees.middle_name, employees.second_name) LIKE :fullname
         OR CONCAT(employees.second_name, employees.first_name, employees.middle_name) LIKE :fullname
         OR CONCAT(employees.second_name, employees.middle_name, employees.first_name) LIKE :fullname
         OR CONCAT(employees.middle_name, employees.first_name, employees.second_name) LIKE :fullname
         OR CONCAT(employees.middle_name, employees.second_name, employees.first_name) LIKE :fullname
         OR employees.email LIKE :email)`,
        { fullname: `%${fullname}%`, email: `%${value}%` },
      )
      .andWhere(updatedFilters)
      .orderBy("employees.created_at", "DESC")
      .take(perPage)
      .skip(skip)
      .getManyAndCount();
  }

  async deleteEmployeeById(employeeId: string) {
    const isEmployeeExist = await this.findBy({ id: employeeId });
    if (!isEmployeeExist) {
      throw new NotFoundException({
        message: [{ type: "common_error", text: "Пользователь не найден" }],
      });
    }
    return this.employeeRepository.delete({ id: employeeId });
  }
}
