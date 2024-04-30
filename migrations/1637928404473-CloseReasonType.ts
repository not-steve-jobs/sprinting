import {MigrationInterface, QueryRunner} from 'typeorm';

export class CloseReasonType1637928404473 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.removeOldReasonsFor101(queryRunner);
    await queryRunner.query(`ALTER TABLE "CloseReason" ADD COLUMN "type" CHARACTER VARYING DEFAULT 'internal'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "CloseReason" DROP COLUMN "type"`);
  }

  public async removeOldReasonsFor101(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "CloseReason" WHERE "tenantId"=101`);
  }
}
