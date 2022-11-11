import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

import { ProductEntity, StallEntity, UserEntity } from "../../App/entities";

dotenv.config();

export const DB_DATASOURCE = new DataSource({
  type: "postgres",
  port: parseInt(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  host: process.env.PG_HOST,
  entities: [StallEntity, UserEntity, ProductEntity],
});
