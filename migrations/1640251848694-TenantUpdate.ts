import {MigrationInterface, QueryRunner} from 'typeorm';

export class TenantUpdate1640251848694 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Tenant" ADD COLUMN "customAppProperties" jsonb DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Tenant" DROP COLUMN "customAppProperties"`);
  }
}
