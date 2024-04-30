import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, addUQ} from './MigrationHelper';

export class ClientConfigurationCreate1613661845503 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "ClientConfiguration" (
        "tenantId" integer NOT NULL,
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "channel" character varying(255) NOT NULL,
        "feature" character varying(255) NOT NULL,
        "clientId" uuid NOT NULL,
        "config" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "isEnabled" boolean NOT NULL DEFAULT true,
        "roleId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('ClientConfiguration', ['tenantId', 'id'])},
        ${addFK('ClientConfiguration', ['tenantId'], 'Tenant', ['id'])},
        ${addFK('ClientConfiguration', ['clientId'], 'Client', ['id'])},
        ${addUQ('ClientConfiguration', ['tenantId', 'channel', 'feature', 'roleId', 'clientId'])}
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "ClientConfiguration"`);
  }
}
