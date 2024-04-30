import {MigrationInterface, QueryRunner} from 'typeorm';

export class keyNameColumn1635926459340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "Department" ADD COLUMN "keyName" character varying(255) DEFAULT NULL');
    await queryRunner.query(
      'ALTER TABLE "DepartmentFunction" ADD COLUMN "keyName" character varying(255) DEFAULT NULL',
    );
    await queryRunner.query('ALTER TABLE "JobRole" ADD COLUMN "keyName" character varying(255) DEFAULT NULL');
    await queryRunner.query('ALTER TABLE "Level" ADD COLUMN "keyName" character varying(255) DEFAULT NULL');
    await queryRunner.query('ALTER TABLE "Rate" ADD COLUMN "keyName" character varying(255) DEFAULT NULL');
    await queryRunner.query('ALTER TABLE "Role" ADD COLUMN "keyName" character varying(255) DEFAULT NULL');
    await queryRunner.query('ALTER TABLE "Sector" ADD COLUMN "keyName" character varying(255) DEFAULT NULL');
    await queryRunner.query('ALTER TABLE "ServiceType" ADD COLUMN "keyName" character varying(255) DEFAULT NULL');
    await queryRunner.query('ALTER TABLE "Shift" ADD COLUMN "keyName" character varying(255) DEFAULT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "Department" DROP COLUMN "keyName"');
    await queryRunner.query('ALTER TABLE "DepartmentFunction" DROP COLUMN "keyName"');
    await queryRunner.query('ALTER TABLE "JobRole" DROP COLUMN "keyName"');
    await queryRunner.query('ALTER TABLE "Level" DROP COLUMN "keyName"');
    await queryRunner.query('ALTER TABLE "Rate" DROP COLUMN "keyName"');
    await queryRunner.query('ALTER TABLE "Role" DROP COLUMN "keyName"');
    await queryRunner.query('ALTER TABLE "Sector" DROP COLUMN "keyName"');
    await queryRunner.query('ALTER TABLE "ServiceType" DROP COLUMN "keyName"');
    await queryRunner.query('ALTER TABLE "Shift" DROP COLUMN "keyName"');
  }
}
