import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class TenantUserCreate1597753576697 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "TenantUser" (
      "tenantId" integer NOT NULL,
      "userId" uuid NOT NULL,
      "roleId" integer NOT NULL,
      "statusId" integer NOT NULL,
      "disableReasonId" integer DEFAULT NULL,
      "otherDisableReason" character varying(255) DEFAULT NULL,
      "activationDate" TIMESTAMP DEFAULT NULL,
      "deletionDate" TIMESTAMP DEFAULT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('TenantUser', ['tenantId', 'userId'])},
      ${addFK('TenantUser', ['tenantId'], 'Tenant', ['id'])},
      ${addFK('TenantUser', ['userId'], 'User', ['id'])},
      ${addFK('TenantUser', ['tenantId', 'statusId'], 'Status', ['tenantId', 'id'])},
      ${addFK('TenantUser', ['roleId'], 'Role', ['id'])},
      ${addFK('TenantUser', ['disableReasonId'], 'DisableReason', ['id'])}
    )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "TenantUser"`, undefined);
  }
}
