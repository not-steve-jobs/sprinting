import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class JobRoleTemplateCreate1628826521335 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "JobRoleTemplate" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "tenantId" integer NOT NULL,
      "jobRoleId" uuid NOT NULL,
      "languageId" uuid DEFAULT NULL,
      "template" text DEFAULT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      ${addPK('JobRoleTemplate', ['tenantId', 'id'])},
      ${addFK('JobRoleTemplate', ['tenantId', 'jobRoleId'], 'JobRole', ['tenantId', 'id'])},
      ${addFK('JobRoleTemplate', ['languageId'], 'Language', ['id'])}
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "JobRoleTemplate"`);
  }
}
