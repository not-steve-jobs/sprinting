import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, addUQ} from './MigrationHelper';

export class JobOrderAssociateCaseCreate1630321620927 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "JobOrderAssociateCase" (
            "tenantId" integer NOT NULL,
            "userId" uuid NOT NULL,
            "jobOrderId" uuid NOT NULL,
            "caseId" uuid NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('JobOrderAssociateCase', ['tenantId', 'userId', 'jobOrderId', 'caseId'])},
            ${addFK('JobOrderAssociateCase', ['tenantId', 'userId', 'jobOrderId'], 'JobOrderAssociate', [
              'tenantId',
              'userId',
              'jobOrderId',
            ])},
            ${addFK('JobOrderAssociateCase', ['caseId', 'tenantId'], 'Case', ['id', 'tenantId'])},
            ${addUQ('JobOrderAssociateCase', ['caseId'])}
            )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "JobOrderAssociateCase"`);
  }
}
