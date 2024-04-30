import {statusStageTranscoKeys} from 'src/seed/tenantSpecific/transformations/data/statusStageTransco.data';
import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK} from './MigrationHelper';

export class StatusStageTranscoTableCreate1643969733000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE transformations."StatusStageTransco" (
          "stage" character varying(50) NOT NULL,
          "country" character varying(50) NOT NULL,
          "brand" character varying(50) NOT NULL,
          "statusId" integer NOT NULL,
          ${addPK('StatusStageTransco', statusStageTranscoKeys)}
        )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE transformations."StatusStage"`);
  }
}
