import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { StallEntity } from "APP/entities";

import { CreateStallDto } from "./dto";

@Injectable()
export class StallService {
  constructor(
    @InjectRepository(StallEntity)
    private readonly stallRepository: Repository<StallEntity>,
  ) {}

  create(stall: CreateStallDto) {
    return this.stallRepository.save({
      ...stall,
    });
  }

  findBy(field: "id" | "name" | "address", value: string | number) {
    return this.stallRepository.findOne({
      where: { [field]: value },
      relations: {
        employees: true,
        products: true,
      },
      cache: 1000 * 60 * 60,
    });
  }

  findAll() {
    return this.stallRepository.find({
      relations: { employees: true, products: true },
      cache: 1000 * 60 * 60,
    });
  }
}
