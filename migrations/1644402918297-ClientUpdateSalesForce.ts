import {MigrationInterface, QueryRunner} from 'typeorm';

export class ClientUpdateSalesForce1644402918297 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Client" ADD COLUMN "status" character varying(32) DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Client" DROP COLUMN "status"`);
  }
}
