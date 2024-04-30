import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addFK} from './MigrationHelper';

export class RegionCreate1630727457452 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "Region" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "tenantId" integer NOT NULL,
            "name" character varying(255) NOT NULL,
            "default" boolean NOT NULL DEFAULT FALSE,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('Region', ['id'])},
            ${addFK('Region', ['tenantId'], 'Tenant', ['id'])}
            )`);

    await queryRunner.query(
      `CREATE INDEX "IDX_Region_name"
                  ON "Region"("name")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Region"`);
  }
}
