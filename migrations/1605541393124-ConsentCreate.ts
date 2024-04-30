import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class ConsentCreate1605541393124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Consent" (
      "id" uuid NOT NULL,
      "tenantId" integer NOT NULL,
      "url" varchar NOT NULL,
      "type" varchar NOT NULL,
      "version" int DEFAULT NULL,
      "validFrom" TIMESTAMP NOT NULL,
      "isMandatory" BOOLEAN DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('Consent', ['id', 'tenantId'])},
      ${addFK('Consent', ['tenantId'], 'Tenant', ['id'])}
    )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Consent');
  }
}
