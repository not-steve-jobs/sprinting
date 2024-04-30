import {JobOrderAssociateStatus} from 'src/modules/status/status.enum';
import {MigrationInterface, QueryRunner} from 'typeorm';

export class BI_JobOrderCreate1630482114456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE OR REPLACE VIEW public."BI_JobOrder"
      AS
      SELECT "JobOrder".id,
         "JobOrder"."tenantId",
         "Country".name AS "countryName",
         "Tenant".brand AS "brandName",
         "JobOrder".name,
         "JobOrder"."jobDescription",
         "JobOrder"."additionalInformation",
         "JobRole".name AS "jobRoleName",
         "Client".name AS "clientName",
         "Location"."locationName",
         "Branch".name AS "branchName",
         "JobOrderStatus".name AS "statusName",
         "JobOrder"."dateStart",
         "JobOrder"."dateEnd",
         "JobOrder"."submissionDate",
         "JobOrder".rejected::integer AS rejected,
         "JobOrder"."numberOfOpenings",
         cast ( (SELECT count(*) FROM "JobOrderAssociate" WHERE "statusId" in 
	                                (SELECT "Status"."id" FROM "Status" 
	                                  	WHERE "Status"."entityName" = 'JobOrderAssociate' 
	 	                                	AND "Status"."name" IN ('${JobOrderAssociateStatus.PreContract}', '${JobOrderAssociateStatus.ClosingReport}')) 
	                                AND "JobOrderAssociate"."rejected" = false
                                  AND "JobOrderAssociate"."jobOrderId" = "JobOrder"."id") as int) as "filledPositions",
         "JobOrder"."dayOneGuidance",
         "JobOrder"."daysInWeek"::text AS "daysInWeek",
         "ContractType".name AS "contractTypeName",
         "EmploymentType".name AS "employmentTypeName",
         "JobOrder".salary,
         "JobOrder"."salaryHigh",
         "Experience".name AS experience,
         "CloseReason".reason AS "closeReason",
         "JobOrder"."createdAt",
         "JobOrder"."updatedAt"
        FROM "JobOrder"
          JOIN "Tenant" ON "JobOrder"."tenantId" = "Tenant".id
          JOIN "Country" ON "Tenant"."countryId" = "Country".id
          LEFT JOIN "JobRole" ON "JobOrder"."jobRoleId" = "JobRole".id
          LEFT JOIN "Client" ON "JobOrder"."clientId" = "Client".id
          LEFT JOIN "Location" ON "JobOrder"."locationId" = "Location".id
          LEFT JOIN "Branch" ON "JobOrder"."branchId" = "Branch".id
          LEFT JOIN "Status" "JobOrderStatus" ON "JobOrder"."statusId" = "JobOrderStatus".id
          LEFT JOIN "Type" "ContractType" ON "JobOrder"."contractTypeId" = "ContractType".id
          LEFT JOIN "Type" "EmploymentType" ON "JobOrder"."employmentTypeId" = "EmploymentType".id
          LEFT JOIN "Level" "Experience" ON "JobOrder"."experienceId" = "Experience".id
          LEFT JOIN "CloseReason" ON "JobOrder"."closeReasonId" = "CloseReason".id;`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP VIEW "BI_JobOrder"`, undefined);
  }
}
