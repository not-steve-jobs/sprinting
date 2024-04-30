import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobOrderUpdate1640785819236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" ADD COLUMN "workType" integer DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" DROP COLUMN "workType"`);
  }
}
