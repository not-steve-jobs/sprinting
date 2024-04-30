import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addFK} from './MigrationHelper';

export class JobOrderCertificationCreate1607999021474 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "JobOrderCertification" (
        "tenantId" integer NOT NULL,
        "jobOrderId" uuid NOT NULL,
        "certificationId" uuid NOT NULL,
        "dateStart" TIMESTAMP DEFAULT NULL,
        "dateEnd" TIMESTAMP DEFAULT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        ${addPK('JobOrderCertification', ['tenantId', 'jobOrderId', 'certificationId'])},
        ${addFK('JobOrderCertification', ['jobOrderId', 'tenantId'], 'JobOrder', ['id', 'tenantId'])},
        ${addFK('JobOrderCertification', ['certificationId'], 'Certification', ['id'])}
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_JobOrderCertification_dateStart"
              ON "JobOrderCertification"("dateStart")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_JobOrderCertification_dateEnd"
              ON "JobOrderCertification"("dateEnd")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "JobOrderCertification"`);
  }
}
