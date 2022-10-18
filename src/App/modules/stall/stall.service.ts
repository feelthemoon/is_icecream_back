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
    return this.stallRepository.find({
      where: { [field]: value },
      relations: {
        employees: true,
        products: true,
      },
      cache: { id: value, milliseconds: 3600 },
    });
  }

  findAll() {
    return this.stallRepository.find({
      relations: { employees: true, products: true },
      cache: { id: 999_999_999, milliseconds: 3600 },
    });
  }
}
