import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class TenantUserLocationCreate1605889309640 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "TenantUserLocation" (
      "tenantId" integer NOT NULL,
      "userId" uuid NOT NULL,
      "locationId" uuid NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      ${addPK('TenantUserLocation', ['tenantId', 'userId', 'locationId'])},
      ${addFK('TenantUserLocation', ['tenantId', 'userId'], 'TenantUser', ['tenantId', 'userId'])},
      ${addFK('TenantUserLocation', ['locationId'], 'Location', ['id'])}
    )`);

    await queryRunner.query(
      `CREATE INDEX "IDX_TenantUserLocation_tenantId"
      ON "TenantUserLocation"("tenantId")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_TenantUserLocation_locationId"
        ON "TenantUserLocation"("locationId")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "TenantUserLocation"`);
  }
}
