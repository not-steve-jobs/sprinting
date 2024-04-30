import {closingReasonTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/closingReasonTransco.data';
import {contractTypeTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/contractTypeTransco.data';
import {experienceTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/experienceTransco.data';
import {levelSkillTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/levelSkillTransco.data';
import {ratePeriodTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/ratePeriodTransco.data';
import {serviceTypeRecordTypeTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/serviceTypeRecordTypeTransco.data';
import {shiftTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/shiftTransco.data';
import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK} from './MigrationHelper';
export class JobTranscoTablesCreate1646210471000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        `CREATE TABLE transformations."ContractTypeTransco" (
          "contractTypeId" integer NOT NULL,
          "contractType" character varying(255) NOT NULL,
          "brand" character varying(255) NOT NULL,
          "country" character varying(255) NOT NULL,
          ${addPK('ContractTypeTransco', contractTypeTranscoKeys)}
        )`,
      ),
      queryRunner.query(
        `CREATE TABLE transformations."ShiftTransco" (
          "shiftId" integer NOT NULL,
          "shift" character varying(255) NOT NULL,
          "brand" character varying(255) NOT NULL,
          "country" character varying(255) NOT NULL,
          ${addPK('ShiftTransco', shiftTranscoKeys)}
        )`,
      ),
      queryRunner.query(
        `CREATE TABLE transformations."RatePeriodTransco" (
          "rateId" integer NOT NULL,
          "payRatePeriod" character varying(255) NOT NULL,
          "brand" character varying(255) NOT NULL,
          "country" character varying(255) NOT NULL,
          ${addPK('RatePeriodTransco', ratePeriodTranscoKeys)}
        )`,
      ),
      queryRunner.query(
        `CREATE TABLE transformations."ClosingReasonTransco" (
          "reasonId" integer NOT NULL,
          "closedReason" character varying(255) NOT NULL,
          "brand" character varying(255) NOT NULL,
          "country" character varying(255) NOT NULL,
          ${addPK('ClosingReasonTransco', closingReasonTranscoKeys)}
        )`,
      ),
      queryRunner.query(
        `CREATE TABLE transformations."LevelSkillTransco" (
          "levelId" integer NOT NULL,
          "skillLevel" integer NULL,
          ${addPK('ClosingReasonTransco', levelSkillTranscoKeys)}
        )`,
      ),
      queryRunner.query(
        `CREATE TABLE transformations."ExperienceTransco" (
          "experienceId" integer NOT NULL,
          "yearsOfExperience" character varying(255) NOT NULL,
          ${addPK('ClosingReasonTransco', experienceTranscoKeys)}
        )`,
      ),
      queryRunner.query(
        `CREATE TABLE transformations."ServiceTypeRecordTypeTransco" (
          "serviceTypeId" integer NOT NULL,
          "recordTypeDeveloperName" character varying(255) NOT NULL,
          "brand" character varying(255) NOT NULL,
          "country" character varying(255) NOT NULL,
          ${addPK('ServiceTypeRecordTypeTransco', serviceTypeRecordTypeTranscoKeys)}
        )`,
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([queryRunner.query(`DROP TABLE transformations."ContractTypeTransco"`)]);
    await Promise.all([queryRunner.query(`DROP TABLE transformations."ShiftTransco"`)]);
    await Promise.all([queryRunner.query(`DROP TABLE transformations."RatePeriodTransco"`)]);
    await Promise.all([queryRunner.query(`DROP TABLE transformations."ClosingReasonTransco"`)]);
    await Promise.all([queryRunner.query(`DROP TABLE transformations."LevelSkillTransco"`)]);
    await Promise.all([queryRunner.query(`DROP TABLE transformations."ExperienceTransco"`)]);
    await Promise.all([queryRunner.query(`DROP TABLE transformations."ServiceTypeRecordTypeTransco"`)]);
  }
}
