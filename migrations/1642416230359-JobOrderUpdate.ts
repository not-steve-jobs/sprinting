import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobOrderUpdate1642416230359 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" RENAME COLUMN "workType" TO "workTypeId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" RENAME COLUMN "workTypeId" TO "workType"`);
  }
}
