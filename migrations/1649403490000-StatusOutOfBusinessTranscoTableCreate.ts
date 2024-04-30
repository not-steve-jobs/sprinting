import {statusOutOfBusinessTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/statusOutOfBusinessTransco.data';
import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK} from './MigrationHelper';
export class StatusOutOfBusinessTranscoTableCreate1649403490000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE transformations."StatusOutOfBusinessTransco" (
            "status" character varying(255) NOT NULL,
            "outOfBusiness" boolean NOT NULL,
            ${addPK('StatusOutOfBusinessTransco', statusOutOfBusinessTranscoKeys)}
          )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE transformations."StatusOutOfBusinessTransco"`);
  }
}
