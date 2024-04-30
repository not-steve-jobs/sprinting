import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addFK, addUQ} from './MigrationHelper';

export class JobOrderLanguageCreate1607998126280 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "JobOrderLanguage" (
        "tenantId" integer NOT NULL,
        "jobOrderId" uuid NOT NULL,
        "languageId" uuid NOT NULL,
        "levelId" integer DEFAULT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        ${addPK('JobOrderLanguage', ['tenantId', 'jobOrderId', 'languageId'])},
        ${addUQ('JobOrderLanguage', ['jobOrderId', 'languageId'])},
        ${addFK('JobOrderLanguage', ['jobOrderId', 'tenantId'], 'JobOrder', ['id', 'tenantId'])},
        ${addFK('JobOrderLanguage', ['languageId'], 'Language', ['id'])},
        ${addFK('JobOrderLanguage', ['levelId'], 'Level', ['id'])}
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "JobOrderLanguage"`);
  }
}
