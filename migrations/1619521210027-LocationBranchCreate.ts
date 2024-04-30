import {addPK, addFK} from './MigrationHelper';
import {MigrationInterface, QueryRunner} from 'typeorm';

export class LocationBranchCreate1619521210027 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "LocationBranch" (
        "tenantId" integer NOT NULL,
        "locationId" uuid NOT NULL,
        "branchId" uuid NOT NULL,
        "inTerritory" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        ${addPK('LocationBranch', ['tenantId', 'locationId', 'branchId'])},
        ${addFK('LocationBranch', ['tenantId'], 'Tenant', ['id'])},
        ${addFK('LocationBranch', ['locationId'], 'Location', ['id'])},
        ${addFK('LocationBranch', ['tenantId', 'branchId'], 'Branch', ['tenantId', 'id'])}
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "LocationBranch"`);
  }
}
