import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addFK} from './MigrationHelper';

export class CloseReasonArgumentsCreate1637937784349 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "CloseReasonArguments" (
        "tenantId" integer NOT NULL,
        "jobOrderId" uuid NOT NULL,
        "closeReasonId" integer NOT NULL,
        "closedBy" uuid NOT NULL,
        "comment" text DEFAULT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('CloseReasonArguments', ['tenantId', 'jobOrderId'])},
        ${addFK('CloseReasonArguments', ['tenantId'], 'Tenant', ['id'])},
        ${addFK('CloseReasonArguments', ['tenantId', 'jobOrderId'], 'JobOrder', ['tenantId', 'id'])},
        ${addFK('CloseReasonArguments', ['tenantId', 'closeReasonId'], 'CloseReason', ['tenantId', 'id'])}
        )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CloseReasonArguments_closedBy"
          ON "CloseReasonArguments"("closedBy")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CloseReasonArguments_comment"
          ON "CloseReasonArguments"("comment")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP INDEX "IDX_CloseReasonArguments_closedBy"`);
    await queryRunner.query(`DROP INDEX "IDX_CloseReasonArguments_comment"`);
    await queryRunner.query(`DROP TABLE "CloseReasonArguments"`, undefined);
  }
}
