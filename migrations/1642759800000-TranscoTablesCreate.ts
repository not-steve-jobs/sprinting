import {caseCategoryTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/caseCategoryTransco.data';
import {caseStatusTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/caseStatusTransco.data';
import {locationAccountTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/locationAccountTransco.data';
import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK} from './MigrationHelper';

export class TranscoTablesCreate1642759800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        `CREATE TABLE transformations."CaseCategoryTransco" (
          "category" integer NOT NULL,
          "caseReason" character varying(255) NOT NULL,
          "comment" character varying(255) NOT NULL,
          ${addPK('CaseCategoryTransco', caseCategoryTranscoKeys)}
        )`,
      ),
      queryRunner.query(
        `CREATE TABLE transformations."CaseStatusTransco" (
          "status" character varying(50) NOT NULL,
          "statusId" integer NOT NULL,
          "country" character varying(50) NOT NULL,
          "brand" character varying(50) NOT NULL,
          "tenantId" integer NOT NULL,
          "description" character varying(255) NOT NULL,
          ${addPK('CaseStatusTransco', caseStatusTranscoKeys)}
        )`,
      ),
      queryRunner.query(
        `CREATE TABLE transformations."LocationAccountTransco" (
          "category" integer NOT NULL,
          "description" character varying(255) NULL,
          "locationId" uuid NULL,
          "accountConcernedGuid" uuid NULL,
          ${addPK('LocationAccountTransco', locationAccountTranscoKeys)}
        )`,
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(`DROP TABLE transformations."CaseCategoryTransco"`),
      queryRunner.query(`DROP TABLE transformations."CaseStatusTransco"`),
      queryRunner.query(`DROP TABLE transformations."LocationAccountTransco"`),
    ]);
  }
}
