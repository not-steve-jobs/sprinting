import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK} from './MigrationHelper';

export class ClientProfileUpdateSalesForce1644320468272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ClientProfile" ADD COLUMN "externalCustomerId" character varying(255) DEFAULT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ClientProfile" ADD COLUMN "street" character varying(255) DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" ADD COLUMN "street2" character varying(255) DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" ADD COLUMN "city" character varying(255) DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" ADD COLUMN "state" character varying(2) DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" ADD COLUMN "zip" character varying(10) DEFAULT NULL`);
    await queryRunner.query(`
      ALTER TABLE "ClientProfile"
      ADD COLUMN "countryId" uuid DEFAULT NULL,
        ADD ${addFK('ClientProfile', ['countryId'], 'Country', ['id'])}`);
    await queryRunner.query(
      `ALTER TABLE "ClientProfile" ADD COLUMN "nationalAccountManager" character varying(255) DEFAULT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ClientProfile" ADD COLUMN "branchCostCenter" character varying(255) DEFAULT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ClientProfile" ADD COLUMN "customerType" character varying(32) DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" ADD COLUMN "contractRequired" BOOLEAN DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ClientProfile" DROP COLUMN "externalCustomerId"`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" DROP COLUMN "street"`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" DROP COLUMN "street2"`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" DROP COLUMN "zip"`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" DROP COLUMN "countryCode"`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" DROP COLUMN "nationalAccountManager"`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" DROP COLUMN "branchCostCenter"`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" DROP COLUMN "customerType"`);
    await queryRunner.query(`ALTER TABLE "ClientProfile" DROP COLUMN "contractRequired"`);
  }
}
