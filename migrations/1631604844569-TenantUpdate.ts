import {MigrationInterface, QueryRunner} from 'typeorm';

export class TenantUpdate1631604844569 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Tenant" ADD COLUMN "destinationSystem" character varying(255) NOT NULL DEFAULT 'Infocore'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Tenant" DROP COLUMN "destinationSystem"`);
  }
}
