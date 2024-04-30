import {MigrationInterface, QueryRunner} from 'typeorm';

export class FeatureConfigurationCreate1583441195000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // TODO: Change isEnabled to false
    await queryRunner.query(
      `CREATE TABLE "FeatureConfiguration" (
          "tenantId" integer NOT NULL,
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "channel" character varying(255) NOT NULL,
          "feature" character varying(255) NOT NULL,
          "config" jsonb NOT NULL DEFAULT '{}'::jsonb,
          "isEnabled" boolean NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_FeatureConfiguration_tenantId_id" PRIMARY KEY ("tenantId", "id"),
          CONSTRAINT "UQ_FeatureConfiguration_tenantId_channel_feature" UNIQUE ("tenantId", "channel", "feature"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "FeatureConfiguration"
          ADD CONSTRAINT "FK_FeatureConfiguration_tenantId_Tenant_id"
          FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "FeatureConfiguration" DROP CONSTRAINT "FK_FeatureConfiguration_tenantId_Tenant_id"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "FeatureConfiguration"`, undefined);
  }
}
