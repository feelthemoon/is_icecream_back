import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { hash } from "bcrypt";
import { Like, Repository } from "typeorm";

import { UserEntity } from "APP/entities";
import { SignupDto } from "APP/modules/auth/dto/auth.dto";

import { AddSelectType, FindFieldType, UpdateFieldType } from "./types";

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
    field: FindFieldType,
    value: string | number,
    addSelectField?: AddSelectType,
  ): Promise<UserEntity | null> {
    if (addSelectField) {
      return this.userRepository
        .createQueryBuilder("users")
        .addSelect(`users.${addSelectField}`)
        .where({ [field]: value })
        .leftJoinAndSelect("users.stall", "stall")
        .cache(true)
        .getOne();
    }
    return this.userRepository.findOne({
      where: { [field]: value },
      relations: { stall: true },
      cache: 1000 * 60 * 60,
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
    field: FindFieldType,
    value: string | number,
  ): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: { [field]: Like(`${value}%`), confirmed: true },
      cache: 1000 * 60 * 60,
    });
  }

  async updateOne(
    id: string,
    updatedFiled: UpdateFieldType,
    value: string,
  ): Promise<UserEntity | null> {
    const user = await this.findBy("id", id);
    if (!user) {
      throw new NotFoundException({
        message: [{ type: "common_error", text: "Ползьватель не найден" }],
      });
    }
    if (updatedFiled === "password") {
      user.password = await hash(value, 10);
      return this.userRepository.save(user);
    }
    user[updatedFiled] = value;
    return this.userRepository.save(user);
  }

  async updateConfirmed(
    id: number,
    isConfirmed: boolean,
  ): Promise<UserEntity | null> {
    const user = await this.findBy("id", id);
    if (!user) {
      throw new NotFoundException({
        message: [{ type: "common_error", text: "Пользователь не найден" }],
      });
    }
    user.confirmed = isConfirmed;
    return this.userRepository.save(user);
  }
}
