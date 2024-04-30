import {MigrationInterface, QueryRunner} from 'typeorm';

export class userProfileUpdate1645527468304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserProfile" ADD COLUMN "externalContactId" character varying(255) DEFAULT NULL;`,
    );
    await queryRunner.query(`ALTER TABLE "UserProfile" ADD COLUMN "street" character varying(255) DEFAULT NULL;`);
    await queryRunner.query(`ALTER TABLE "UserProfile" ADD COLUMN "street2" character varying(255) DEFAULT NULL;`);
    await queryRunner.query(`ALTER TABLE "UserProfile" ADD COLUMN "city" character varying(255) DEFAULT NULL;`);
    await queryRunner.query(`ALTER TABLE "UserProfile" ADD COLUMN "state" character varying(255) DEFAULT NULL;`);
    await queryRunner.query(`ALTER TABLE "UserProfile" ADD COLUMN "country" character varying(255) DEFAULT NULL;`);
    await queryRunner.query(`ALTER TABLE "UserProfile" ADD COLUMN "zip" character varying(255) DEFAULT NULL;`);
    await queryRunner.query(
      `ALTER TABLE "UserProfile" ADD COLUMN "escalationTimesheetApprover" character varying(255) DEFAULT NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserProfile" ADD COLUMN "billToInvoiceEmail" character varying(255) DEFAULT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "externalContactId"`);
    await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "street"`);
    await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "street2"`);
    await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "country"`);
    await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "zip"`);
    await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "escalationTimesheetApprover"`);
    await queryRunner.query(`ALTER TABLE "UserProfile" DROP COLUMN "billToInvoiceEmail"`);
  }
}
