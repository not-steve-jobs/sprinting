import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class TenantUserPermissionCreate1605862051036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "TenantUserPermission" (
      "tenantId" integer NOT NULL,
      "userId" uuid NOT NULL,
      "permissionId" uuid NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      ${addPK('TenantUserPermission', ['tenantId', 'userId', 'permissionId'])},
      ${addFK('TenantUserPermission', ['tenantId', 'userId'], 'TenantUser', ['tenantId', 'userId'])},
      ${addFK('TenantUserPermission', ['permissionId', 'tenantId'], 'Permission', ['id', 'tenantId'])}
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_TenantUserPermission_tenantId"
      ON "TenantUserPermission"("tenantId")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_TenantUserPermission_permissionId"
        ON "TenantUserPermission"("permissionId")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "TenantUserPermission"`);
  }
}
