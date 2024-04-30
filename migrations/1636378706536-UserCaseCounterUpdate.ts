import {MigrationInterface, QueryRunner} from 'typeorm';

export class UserCaseCounterUpdate1636378706536 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "UserProfile" ADD COLUMN "caseCounter" integer DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "caseCounter"`);
  }
}
