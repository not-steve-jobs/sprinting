import {jobOrderStatusTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/jobOrderStatusTransco.data';
import {jobRoleTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/jobRoleTransco.data';
import {workTypeTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/workTypeTransco.data';
import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK} from './MigrationHelper';
export class JobTranscoTablesCreate1648629319000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        `CREATE TABLE transformations."WorkTypeTransco" (
          "workTypeId" integer NOT NULL,
          "workType" character varying(255) NOT NULL,
          "brand" character varying(255) NOT NULL,
          "country" character varying(255) NOT NULL,
          ${addPK('WorkTypeTransco', workTypeTranscoKeys)}
        )`,
      ),
      queryRunner.query(
        `CREATE TABLE transformations."JobOrderStatusTransco" (
            "statusId" integer NOT NULL,
            "status" character varying(255) NOT NULL,
            "brand" character varying(255) NOT NULL,
            "country" character varying(255) NOT NULL,
            ${addPK('JobOrderStatusTransco', jobOrderStatusTranscoKeys)}
          )`,
      ),
      queryRunner.query(
        `CREATE TABLE transformations."JobRoleTransco" (
            "jobRoleId" uuid NOT NULL,
            "jobRole" character varying(255) NOT NULL,
            "brand" character varying(255) NOT NULL,
            "country" character varying(255) NOT NULL,
            ${addPK('JobRoleTransco', jobRoleTranscoKeys)}
          )`,
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([queryRunner.query(`DROP TABLE transformations."WorkTypeTransco"`)]);
    await Promise.all([queryRunner.query(`DROP TABLE transformations."JobOrderStatusTransco"`)]);
    await Promise.all([queryRunner.query(`DROP TABLE transformations."JobRoleTransco"`)]);
  }
}
