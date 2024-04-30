import {MigrationInterface, QueryRunner} from 'typeorm';

export class BIJobOrderUserAccessCreate1634558122948 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE OR REPLACE VIEW public."BI_JobOrder_UserAccess"
            AS
            SELECT "JobOrder".id,
               "User".email AS "userName"
              FROM "JobOrder"
                JOIN "TenantUser" ON "JobOrder"."userId" = "TenantUser"."userId" and "JobOrder"."tenantId" = "TenantUser"."tenantId"
                JOIN "User" ON "TenantUser"."userId" = "User"."id"`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP VIEW "BI_JobOrder_UserAccess"`, undefined);
  }
}
