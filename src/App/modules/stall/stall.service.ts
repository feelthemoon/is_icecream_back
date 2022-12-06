import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { FindOptionsWhere, Repository } from "typeorm";

import { StallEntity } from "APP/entities";

import { CreateStallDto } from "./dto";

@Injectable()
export class StallService {
  constructor(
    @InjectRepository(StallEntity)
    private readonly stallRepository: Repository<StallEntity>,
  ) {}

  async create(stall: CreateStallDto) {
    const isStallWithNameExist = await this.stallRepository.findOne({
      where: { name: stall.name },
    });

    if (isStallWithNameExist) {
      throw new BadRequestException({
        message: [
          {
            type: "invalid_data_name",
            text: "Точка с таким названием уже существует",
          },
        ],
      });
    }
    return this.stallRepository.save({
      ...stall,
    });
  }

  findBy(
    searchObject:
      | FindOptionsWhere<StallEntity>
      | FindOptionsWhere<StallEntity>[],
  ) {
    return this.stallRepository.findOne({
      where: searchObject,
      relations: {
        employees: true,
        products: true,
        supplies: true,
      },
    });
  }

  async findAll(
    page: number,
    filters?: FindOptionsWhere<StallEntity> | FindOptionsWhere<StallEntity>[],
  ) {
    const perPage = 15;
    const skip = perPage * page - perPage;

    const [data, total] = await this.stallRepository.findAndCount({
      where: filters,
      relations: { employees: true, products: true, supplies: true },
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
}
