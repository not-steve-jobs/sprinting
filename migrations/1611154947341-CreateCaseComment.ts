import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class CreateCaseComment1611154947341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "CaseComment"
        (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "tenantId" integer NOT NULL,
      "userId" uuid,
      "caseId" uuid NOT NULL,
      "value" varchar DEFAULT NULL,
      "isDraft" BOOLEAN NOT NULL DEFAULT FALSE,
      "filesDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
      "userName" varchar DEFAULT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('CaseComment', ['id', 'tenantId'])},
      ${addFK('CaseComment', ['caseId', 'tenantId'], 'Case', ['id', 'tenantId'])},
      ${addFK('CaseComment', ['userId', 'tenantId'], 'TenantUser', ['userId', 'tenantId'])}
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "CaseComment"`);
  }
}
