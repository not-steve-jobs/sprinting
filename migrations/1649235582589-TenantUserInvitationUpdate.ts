import {MigrationInterface, QueryRunner} from 'typeorm';

export class TenantUserInvitationUpdate1649235582589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "TenantUserInvitation" ADD COLUMN "language" character varying(255) DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "TenantUserInvitation" DROP COLUMN "language"`);
  }
}
