import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class FileCreate1611334850751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "File"
        (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "tenantId" integer NOT NULL,
      "userId" uuid DEFAULT NULL,
      "deletedByUserId" uuid DEFAULT NULL,
      "filePathAndName" varchar NOT NULL,
      "fileName" varchar DEFAULT NULL,
      "caseCommentId" uuid DEFAULT NULL,
      "caseId" uuid DEFAULT NULL,
      "jobOrderId" uuid DEFAULT NULL,
      "entityName" varchar DEFAULT NULL,
      "externalId" uuid DEFAULT NULL,
      "userName" varchar DEFAULT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('File', ['tenantId', 'id'])},
      ${addFK('File', ['userId', 'tenantId'], 'TenantUser', ['userId', 'tenantId'])},
      ${addFK('File', ['deletedByUserId', 'tenantId'], 'TenantUser', ['userId', 'tenantId'])},
      ${addFK('File', ['caseCommentId', 'tenantId'], 'CaseComment', ['id', 'tenantId'])},
      ${addFK('File', ['caseId', 'tenantId'], 'Case', ['id', 'tenantId'])},
      ${addFK('File', ['jobOrderId', 'tenantId'], 'JobOrder', ['id', 'tenantId'])}
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "File"`);
  }
}
