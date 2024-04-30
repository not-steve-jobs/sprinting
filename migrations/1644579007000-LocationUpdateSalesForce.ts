import {MigrationInterface, QueryRunner} from 'typeorm';

export class LocationUpdateSalesForce1644579007000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Location" ADD COLUMN "externalLocationlId" character varying(255) DEFAULT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "Location" ADD COLUMN "street2" character varying(255) DEFAULT NULL`);
    await queryRunner.query(
      `ALTER TABLE "Location" ADD COLUMN "orderOwningOffice" character varying(255) DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Location" ADD COLUMN "employeeOwningOffice" character varying(255) DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Location" ADD COLUMN "billToExternalContactId" character varying(255) DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Location" DROP COLUMN "externalLocationlId"`);
    await queryRunner.query(`ALTER TABLE "Location" DROP COLUMN "street2"`);
    await queryRunner.query(`ALTER TABLE "Location" DROP COLUMN "orderOwningOffice"`);
    await queryRunner.query(`ALTER TABLE "Location" DROP COLUMN "employeeOwningOffice"`);
    await queryRunner.query(`ALTER TABLE "Location" DROP COLUMN "billToExternalContactId"`);
  }
}
