import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class ServiceTypeCreate1607565691478 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ServiceType" (
        "id" integer NOT NULL,
        "tenantId" integer NOT NULL,
        "name" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('ServiceType', ['tenantId', 'id'])},
        ${addFK('ServiceType', ['tenantId'], 'Tenant', ['id'])}
        )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ServiceType_name"
        ON "ServiceType"("name")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ServiceType"`, undefined);
  }
}
