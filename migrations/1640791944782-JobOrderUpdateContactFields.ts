import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobOrderUpdateContactFields1640791944782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder"
      ADD COLUMN "timeSheetApproverId" uuid DEFAULT NULL,
      ADD COLUMN "reportToId" uuid DEFAULT NULL,
      ADD COLUMN "billToId" uuid DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder"
      DROP COLUMN "timeSheetApproverId",
      DROP COLUMN "reportToId",
      DROP COLUMN "billToId"`);
  }
}
