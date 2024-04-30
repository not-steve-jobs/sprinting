import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobRoleAddColumnRcCategoryId1639131568276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobRole" ADD COLUMN "rcCategoryId" character varying(255) DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobRole" DROP COLUMN "rcCategoryId"`);
  }
}
