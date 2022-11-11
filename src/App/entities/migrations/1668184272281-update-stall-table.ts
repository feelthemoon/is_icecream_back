import { MigrationInterface, QueryRunner } from "typeorm";

export class updateStallTable1668184272281 implements MigrationInterface {
  name = "updateStallTable1668184272281";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "stalls"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "stalls" DROP COLUMN "updated_at"
        `);
  }
}
