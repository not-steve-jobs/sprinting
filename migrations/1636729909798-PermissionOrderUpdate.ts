import {MigrationInterface, QueryRunner} from 'typeorm';

export class PermissionOrderUpdate1636729909798 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Permission" ADD COLUMN "orderId" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Permission" DROP COLUMN "orderId"`);
  }
}
