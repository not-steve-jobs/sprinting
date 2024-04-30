import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class TenantCreate1572621538158 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "Tenant" (
      "id" integer NOT NULL,
      "countryId" uuid NOT NULL,
      "domain" character varying(255) NOT NULL,
      "name" character varying(255) NOT NULL,
      "alias" character varying(255) NOT NULL,
      "brand" text NULL,
      "appConfig" jsonb NOT NULL DEFAULT '{"componentsVersion": 1}'::jsonb,
      "website" character varying(255),
      "locale" character varying(255),
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('Tenant', ['id'])},
      ${addFK('Tenant', ['countryId'], 'Country', ['id'])}
    )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "Tenant"`, undefined);
  }
}
