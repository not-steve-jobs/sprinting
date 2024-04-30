import {roleTranscoKeys} from '../src/seed/tenantSpecific/transformations/data/roleTransco.data';
import {addPK} from './MigrationHelper';
import {MigrationInterface, QueryRunner} from 'typeorm';

export class RoleTranscoCreate1647615213277 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `CREATE TABLE transformations."RoleTransco" (
          "roleId" integer NOT NULL,
          "role" character varying(255) NOT NULL,
          ${addPK('CaseStatusTransco', roleTranscoKeys)}
        )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE transformations."RoleTransco"`);
  }
}
