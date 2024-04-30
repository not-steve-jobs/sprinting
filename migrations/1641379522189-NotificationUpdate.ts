import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, fkName, pkName} from './MigrationHelper';

export class NotificationUpdate1641379522189 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Notification" DROP CONSTRAINT ${pkName('Notification', ['tenantId', 'userId', 'caseId', 'type'])}`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notification" DROP CONSTRAINT ${fkName('Notification', ['tenantId', 'caseId'], 'Case', [
        'tenantId',
        'id',
      ])}`,
    );
    await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "caseId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Notification" RENAME COLUMN "caseId" TO "entityId"`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD COLUMN "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD COLUMN "entityName" character varying(255) DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "Notification" ADD ${addPK('Notification', ['id'])}`);

    // Migrate the existing records
    await queryRunner.query(`UPDATE "Notification" SET "entityName"='Case' WHERE "entityId" IS NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Notification" DROP CONSTRAINT ${pkName('Notification', ['id'])}`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "entityName"`);
    await queryRunner.query(`ALTER TABLE "Notification" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "Notification" RENAME COLUMN "entityId" TO "caseId"`);
    // No way to revert this rule anymore because we may have some NULLs in the DB
    // await queryRunner.query(`ALTER TABLE "Notification" ALTER COLUMN "caseId" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "Notification" ADD ${addPK('Notification', ['tenantId', 'userId', 'caseId', 'type'])}`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notification" ADD ${addFK('Notification', ['tenantId', 'caseId'], 'Case', ['tenantId', 'id'])}`,
    );
  }
}
