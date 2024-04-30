import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobOrderUpdateInterviewRequired1636460593533 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" ALTER COLUMN "interviewRequired" SET DEFAULT false`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" ALTER COLUMN "interviewRequired" SET DEFAULT NULL`, undefined);
  }
}
