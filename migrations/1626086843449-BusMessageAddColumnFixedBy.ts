import {MigrationInterface, QueryRunner} from 'typeorm';

export class BusMessageAddColumnFixedBy1626086843449 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "BusMessage" ADD COLUMN "fixedBy" text DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "BusMessageAttempts" ADD COLUMN "fixedBy" text DEFAULT NULL`);
    await queryRunner.query(
      `CREATE INDEX "IDX_BusMessage_fixedBy"
                      ON "BusMessage"("fixedBy")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BusMessageAttempts_fixedBy"
                      ON "BusMessageAttempts"("fixedBy")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "BusMessage" DROP COLUMN "fixedBy"`);
    await queryRunner.query(`ALTER TABLE "BusMessageAttempts" DROP COLUMN "fixedBy"`);
  }
}
