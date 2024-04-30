import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobOrderUpdate1647847745000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" ADD COLUMN "externalId" varchar DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" DROP COLUMN "externalId"`);
  }
}
