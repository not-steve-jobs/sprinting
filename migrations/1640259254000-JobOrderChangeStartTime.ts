import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobOrderChangeStartTime1640259254000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" ALTER COLUMN "startTime" TYPE time`);
    await queryRunner.query(`ALTER TABLE "JobOrder" ALTER COLUMN "endTime" TYPE time`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" ALTER COLUMN "startTime" TYPE date`);
    await queryRunner.query(`ALTER TABLE "JobOrder" ALTER COLUMN "endTime" TYPE date`);
  }
}
