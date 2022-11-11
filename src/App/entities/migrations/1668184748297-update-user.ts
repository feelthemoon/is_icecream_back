import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUser1668184748297 implements MigrationInterface {
  name = "updateUser1668184748297";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updated_at"
        `);
  }
}
