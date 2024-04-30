import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class NotificationCreate1613319256732 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Notification"
        (
      "tenantId" integer NOT NULL,
      "userId" uuid NOT NULL,
      "caseId" uuid DEFAULT NULL,
      "type" varchar NOT NULL,
      "isRead" boolean NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('Notification', ['tenantId', 'userId', 'caseId', 'type'])},
      ${addFK('Notification', ['tenantId', 'userId'], 'TenantUser', ['tenantId', 'userId'])},
      ${addFK('Notification', ['tenantId', 'caseId'], 'Case', ['tenantId', 'id'])}
      )`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Notification"`);
  }
}
