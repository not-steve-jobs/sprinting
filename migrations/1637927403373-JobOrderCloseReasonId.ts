import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK} from './MigrationHelper';

export class JobOrderCloseReasonId1637927403373 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" DROP COLUMN "closeReasonId" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "JobOrder"
        ADD COLUMN "closeReasonId" INTEGER DEFAULT NULL,
        ADD ${addFK('JobOrder', ['tenantId', 'closeReasonId'], 'CloseReason', ['tenantId', 'id'])}`);
  }
}
