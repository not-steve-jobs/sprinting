import {MigrationInterface, QueryRunner} from 'typeorm';
import {AuditLogEntityName, AuditLogOrigin, AuditLogType} from 'src/modules/auditLog/auditLog.enum';

export class AlterJobOrderUpdateToAuditLog1643630984729 implements MigrationInterface {
  // TODO: Maybe add index by type and origin, we can decide later when we see what is used more - read/write
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrderUpdate" RENAME TO "AuditLog";`);
    await queryRunner.query(`ALTER TABLE "AuditLog" RENAME COLUMN "jobOrderId" TO "entityId";`);
    await queryRunner.query(`ALTER TABLE "AuditLog" RENAME COLUMN "payload" TO "changes";`);
    await queryRunner.query(`ALTER TABLE "AuditLog" ADD COLUMN "entityName" character varying(255) DEFAULT NULL;`);
    await queryRunner.query(`ALTER TABLE "AuditLog" ADD COLUMN "type" character varying(64) DEFAULT NULL;`);
    await queryRunner.query(`ALTER TABLE "AuditLog" ADD COLUMN "origin" character varying(64) DEFAULT NULL;`);

    // Migrate the existing data to meet the new format
    await queryRunner.query(`
      UPDATE "AuditLog"
      SET
        "entityName"='${AuditLogEntityName.JobOrder}',
        "type"='${AuditLogType.JobOrderUpdated}',
        "origin"='${AuditLogOrigin.ClientAccess}';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "AuditLog" DROP COLUMN "origin";`);
    await queryRunner.query(`ALTER TABLE "AuditLog" DROP COLUMN "type";`);
    await queryRunner.query(`ALTER TABLE "AuditLog" DROP COLUMN "entityName";`);
    await queryRunner.query(`ALTER TABLE "AuditLog" RENAME COLUMN "changes" TO "payload";`);
    await queryRunner.query(`ALTER TABLE "AuditLog" RENAME COLUMN "entityId" TO "jobOrderId";`);
    await queryRunner.query(`ALTER TABLE "AuditLog" RENAME TO "JobOrderUpdate";`);
  }
}
