import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addFK} from './MigrationHelper';

export class RegionWageCreate1630727457454 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "RegionWage" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "tenantId" integer NOT NULL,
            "regionId" uuid NOT NULL,
            "jobRoleId" uuid NOT NULL,
            "minimum" real NOT NULL,
            "suggested" real NOT NULL,
            "experienceLevelId" integer,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('RegionWage', ['id'])},
            ${addFK('RegionWage', ['regionId'], 'Region', ['id'])},
            ${addFK('RegionWage', ['tenantId', 'jobRoleId'], 'JobRole', ['tenantId', 'id'])},
            ${addFK('RegionWage', ['experienceLevelId'], 'Level', ['id'])}
            )`);

    await queryRunner.query(
      `CREATE INDEX "IDX_RegionWage_regionId"
              ON "Region"("id")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "RegionWage"`);
  }
}
