import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { hash } from "bcrypt";
import { FindOptionsWhere, Repository } from "typeorm";

import { UserEntity } from "APP/entities";
import { SignupDto } from "APP/modules/auth/dto/auth.dto";

import { UserEditDto } from "./dto/UserEdit.dto";
import { AddSelectType, UpdateFieldType } from "./types";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(user: SignupDto): Promise<UserEntity> {
    return this.userRepository.save({
      ...user,
      avatar: `gradient-${Math.floor(Math.random() * 8 + 1)}`,
    });
  }

  findBy(
    searchObject: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
    addSelectField?: AddSelectType,
  ): Promise<UserEntity | null> {
    if (addSelectField) {
      return this.userRepository
        .createQueryBuilder("users")
        .addSelect(`users.${addSelectField}`)
        .where(searchObject)
        .leftJoinAndSelect("users.stall", "stall")
        .getOne();
    }
    return this.userRepository.findOne({
      where: searchObject,
      relations: { stall: true },
    });
  }

  async findAll(page: number, filters?: any) {
    const perPage = 15;
    const skip = perPage * page - perPage;

    const [data, total] = await this.userRepository.findAndCount({
      where: filters,
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
    searchObject: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: searchObject,
      cache: 1000 * 60 * 60,
    });
  }

  async updateField(
    id: string,
    updateField: UpdateFieldType,
    value: any,
  ): Promise<UserEntity | null> {
    const user = await this.findBy({ id }, "password");
    if (!user) {
      throw new NotFoundException({
        message: [{ type: "common_error", text: "Пользователь не найден" }],
      });
    }
    if (updateField === "password") {
      user.password = await hash(value, 10);
      return this.userRepository.save(user);
    }
    user[updateField] = value;
    return this.userRepository.save(user);
  }

  async updateOne(
    id: string,
    updateDto: UserEditDto,
  ): Promise<UserEntity | null> {
    const user = await this.findBy({ id });
    if (!user) {
      throw new NotFoundException({
        message: [{ type: "common_error", text: "Пользователь не найден" }],
      });
    }
    Object.keys(updateDto).forEach((field) => {
      user[field] = updateDto[field];
    });
    return this.userRepository.save(user);
  }

  searchUsersByFullnameOrEmail(
    value: string,
    page: number,
    filters?: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ) {
    const perPage = 15;
    const skip = perPage * page - perPage;

    const fullname = value.replace(/\s/g, "");
    return this.userRepository
      .createQueryBuilder("users")
      .where(
        `(CONCAT(users.first_name, users.second_name, users.middle_name) LIKE :fullname
         OR CONCAT(users.first_name, users.middle_name, users.second_name) LIKE :fullname
         OR CONCAT(users.second_name, users.first_name, users.middle_name) LIKE :fullname
         OR CONCAT(users.second_name, users.middle_name, users.first_name) LIKE :fullname
         OR CONCAT(users.middle_name, users.first_name, users.second_name) LIKE :fullname
         OR CONCAT(users.middle_name, users.second_name, users.first_name) LIKE :fullname
         OR users.email LIKE :email)`,
        { fullname: `%${fullname}%`, email: `%${value}%` },
      )
      .andWhere(filters)
      .orderBy("users.created_at", "DESC")
      .take(perPage)
      .skip(skip)
      .getManyAndCount();
  }

  async deleteUserById(userId: string) {
    const isUserExist = await this.findBy({ id: userId });
    if (!isUserExist) {
      throw new NotFoundException({
        message: [{ type: "common_error", text: "Пользователь не найден" }],
      });
    }
    return this.userRepository.delete({ id: userId });
  }
}
