import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addFK} from './MigrationHelper';

export class RegionPostalCode1630727457453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "RegionPostalCode" (
            "regionId" uuid NOT NULL,
            "zip" character varying(255) NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('Region', ['regionId', 'zip'])},
            ${addFK('Region', ['regionId'], 'Region', ['id'])}
            )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "RegionPostalCode"`);
  }
}
