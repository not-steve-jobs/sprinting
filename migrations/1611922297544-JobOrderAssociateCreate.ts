import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class JobOrderAssociateCreate1611922297544 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "JobOrderAssociate" (
            "tenantId" integer NOT NULL,
            "userId" uuid NOT NULL,
            "jobOrderId" uuid NOT NULL,
            "statusId" integer NOT NULL,
            "rejected" boolean NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('JobOrderAssociate', ['tenantId', 'jobOrderId', 'userId'])},
            ${addFK('JobOrderAssociate', ['tenantId', 'jobOrderId'], 'JobOrder', ['tenantId', 'id'])},
            ${addFK('JobOrderAssociate', ['tenantId', 'statusId'], 'Status', ['tenantId', 'id'])}
            )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_JobOrderAssociate_tenantId"
      ON "JobOrderAssociate"("tenantId")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_JobOrderAssociate_jobOrderId"
        ON "JobOrderAssociate"("jobOrderId")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "JobOrderAssociate"`);
  }
}
