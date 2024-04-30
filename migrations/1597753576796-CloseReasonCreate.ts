import {addPK, addUQ, addFK} from './MigrationHelper';
import {MigrationInterface, QueryRunner} from 'typeorm';

export class CloseReasonCreate1597753576796 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "CloseReason" (
        "id" integer NOT NULL,
        "tenantId" integer NOT NULL,
        "reason" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('CloseReason', ['tenantId', 'id'])},
        ${addFK('CloseReason', ['tenantId'], 'Tenant', ['id'])},
        ${addUQ('CloseReason', ['tenantId', 'reason'])}
        )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CloseReason_reason"
        ON "CloseReason"("reason")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "CloseReason"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_CloseReason_reason"`);
  }
}
