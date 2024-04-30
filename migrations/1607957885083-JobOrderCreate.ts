import {DaysInWeekEnum} from './../src/modules/jobOrder/jobOrder.enum';
import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addFK} from './MigrationHelper';

export class JobOrderCreate1607957885083 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TYPE "DaysInWeekEnum" as ENUM(${Object.values(DaysInWeekEnum)
        .map((i) => `'${i}'`)
        .join(', ')})`,
    );

    await queryRunner.query(
      `CREATE TABLE "JobOrder" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" integer NOT NULL,
        "userId" uuid NOT NULL,
        "clientId" uuid NOT NULL,
        "locationId" uuid DEFAULT NULL,
        "branchId" uuid DEFAULT NULL,
        "serviceTypeId" integer DEFAULT NULL,
        "shiftId" integer DEFAULT NULL,
        "rateId" integer DEFAULT NULL,
        "employmentTypeId" integer DEFAULT NULL,
        "contractTypeId" integer DEFAULT NULL,
        "jobRoleId" uuid DEFAULT NULL,
        "sectorId" uuid DEFAULT NULL,
        "sectorLevelId" integer DEFAULT NULL,
        "statusId" integer NOT NULL,
        "name" character varying(255) DEFAULT NULL,
        "dateStart" TIMESTAMP DEFAULT NULL,
        "dateEnd" TIMESTAMP DEFAULT NULL,
        "startTime" TIMESTAMP DEFAULT NULL,
        "endTime" TIMESTAMP DEFAULT NULL,
        "numberOfOpenings" integer DEFAULT NULL,
        "salary" numeric DEFAULT NULL,
        "salaryHigh" numeric DEFAULT NULL,
        "jobDescription" text DEFAULT NULL,
        "dayOneGuidance" text DEFAULT NULL,
        "additionalInformation" text DEFAULT NULL,
        "interviewRequired" boolean DEFAULT NULL,
        "daysInWeek" "DaysInWeekEnum" ARRAY DEFAULT NULL,
        "uploadedFiles" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "isDisplayed" boolean DEFAULT true,
        "submissionDate" TIMESTAMP DEFAULT NULL,
        "rejected" boolean DEFAULT false,
        "closeReasonId" integer DEFAULT NULL,
        "experienceId" integer DEFAULT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('JobOrder', ['tenantId', 'id'])},
        ${addFK('JobOrder', ['clientId'], 'Client', ['id'])},
        ${addFK('JobOrder', ['tenantId', 'userId'], 'TenantUser', ['tenantId', 'userId'])},
        ${addFK('JobOrder', ['locationId'], 'Location', ['id'])},
        ${addFK('JobOrder', ['tenantId', 'branchId'], 'Branch', ['tenantId', 'id'])},
        ${addFK('JobOrder', ['tenantId', 'serviceTypeId'], 'ServiceType', ['tenantId', 'id'])},
        ${addFK('JobOrder', ['tenantId', 'shiftId'], 'Shift', ['tenantId', 'id'])},
        ${addFK('JobOrder', ['tenantId', 'rateId'], 'Rate', ['tenantId', 'id'])},
        ${addFK('JobOrder', ['tenantId', 'employmentTypeId'], 'EmploymentType', ['tenantId', 'id'])},
        ${addFK('JobOrder', ['tenantId', 'contractTypeId'], 'Type', ['tenantId', 'id'])},
        ${addFK('JobOrder', ['tenantId', 'jobRoleId'], 'JobRole', ['tenantId', 'id'])},
        ${addFK('JobOrder', ['tenantId', 'sectorId'], 'Sector', ['tenantId', 'id'])},
        ${addFK('JobOrder', ['sectorLevelId'], 'Level', ['id'])},
        ${addFK('JobOrder', ['tenantId', 'statusId'], 'Status', ['tenantId', 'id'])},
        ${addFK('JobOrder', ['tenantId', 'closeReasonId'], 'CloseReason', ['tenantId', 'id'])},
        ${addFK('JobOrder', ['experienceId'], 'Level', ['id'])}
        )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_JobOrder_name"
          ON "JobOrder"("name")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_JobOrder_dateStart"
          ON "JobOrder"("dateStart")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_JobOrder_dateEnd"
          ON "JobOrder"("dateEnd")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_JobOrder_numberOfOpenings"
          ON "JobOrder"("numberOfOpenings")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_JobOrder_salary"
          ON "JobOrder"("salary")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_JobOrder_salaryHigh"
          ON "JobOrder"("salaryHigh")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_JobOrder_interviewRequired"
            ON "JobOrder"("interviewRequired")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "JobOrder"`, undefined);
  }
}
