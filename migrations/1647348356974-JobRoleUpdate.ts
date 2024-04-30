import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobRoleUpdate1647348356974 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobRole" DROP COLUMN "colorId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobRole" ADD COLUMN "colorId" INTEGER`);
  }
}
