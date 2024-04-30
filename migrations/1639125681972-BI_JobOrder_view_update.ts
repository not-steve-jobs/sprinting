import {MigrationInterface, QueryRunner} from 'typeorm';
import {JobOrderAssociateStatus} from 'src/modules/status/status.enum';

export class BIJobOrderViewUpdate1639125681972 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `create or replace
                view public."BI_JobOrder" as
                select
                    "JobOrder".id,
                    "JobOrder"."tenantId",
                    "Country".name as "countryName",
                    "Tenant".brand as "brandName",
                    "JobOrder".name,
                    "JobOrder"."jobDescription",
                    "JobOrder"."additionalInformation",
                    "JobRole".name as "jobRoleName",
                    "Client".name as "clientName",
                    "Location"."locationName",
                    "Branch".name as "branchName",
                    "JobOrderStatus".name as "statusName",
                    "JobOrder"."dateStart",
                    "JobOrder"."dateEnd",
                    "JobOrder"."submissionDate",
                    "JobOrder".rejected::integer as rejected,
                    "JobOrder"."numberOfOpenings",
                    cast ( (
                    select
                        count(*)
                    from
                        "JobOrderAssociate"
                    where
                        "statusId" in (
                        select
                            "Status"."id"
                        from
                            "Status"
                        where
                            "Status"."entityName" = 'JobOrderAssociate'
                            and "Status"."name" in ('${JobOrderAssociateStatus.PreContract}', '${JobOrderAssociateStatus.ClosingReport}'))
                        and "JobOrderAssociate"."rejected" = false
                        and "JobOrderAssociate"."jobOrderId" = "JobOrder"."id") as int) as "filledPositions",
                    "JobOrder"."dayOneGuidance",
                    "JobOrder"."daysInWeek"::text as "daysInWeek",
                    "ContractType".name as "contractTypeName",
                    "EmploymentType".name as "employmentTypeName",
                    "JobOrder".salary,
                    "JobOrder"."salaryHigh",
                    "Experience".name as experience,
                    "CloseReason"."reason",
                    "JobOrder"."createdAt",
                    "JobOrder"."updatedAt"
                from
                    "JobOrder"
                join "Tenant" on
                    "JobOrder"."tenantId" = "Tenant".id
                join "Country" on
                    "Tenant"."countryId" = "Country".id
                left join "JobRole" on
                    "JobOrder"."jobRoleId" = "JobRole".id
                left join "Client" on
                    "JobOrder"."clientId" = "Client".id
                left join "Location" on
                    "JobOrder"."locationId" = "Location".id
                left join "Branch" on
                    "JobOrder"."branchId" = "Branch".id
                left join "Status" "JobOrderStatus" on
                    "JobOrder"."statusId" = "JobOrderStatus".id
                left join "Type" "ContractType" on
                    "JobOrder"."contractTypeId" = "ContractType".id
                left join "Type" "EmploymentType" on
                    "JobOrder"."employmentTypeId" = "EmploymentType".id
                left join "Level" "Experience" on
                    "JobOrder"."experienceId" = "Experience".id
                left join "CloseReasonArguments" on
                    "CloseReasonArguments"."tenantId" = "JobOrder"."tenantId"
                    and "CloseReasonArguments"."jobOrderId" = "JobOrder"."id"
                left join "CloseReason" on
                    "CloseReason"."tenantId" = "JobOrder"."tenantId"
                    and "CloseReason"."id" = "CloseReasonArguments"."closeReasonId";`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW "BI_JobOrder"`, undefined);
  }
}
