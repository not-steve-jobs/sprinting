import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class JobOrderUpdate1639656463386 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "JobOrderUpdate" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "jobOrderId" uuid NOT NULL,
      "tenantId" integer NOT NULL,
      "userId" uuid DEFAULT null,
      "firstName" character varying(255) DEFAULT null,
      "lastName" character varying(255) DEFAULT null,
      "payload" jsonb NOT NULL DEFAULT '{}'::jsonb,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      ${addPK('JobOrderUpdate', ['id'])},
      ${addFK('JobOrderUpdate', ['jobOrderId', 'tenantId'], 'JobOrder', ['id', 'tenantId'])},
      ${addFK('JobOrderUpdate', ['tenantId'], 'Tenant', ['id'])},
      ${addFK('JobOrderUpdate', ['userId'], 'User', ['id'])}
  )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "JobOrderUpdate"`);
  }
}
