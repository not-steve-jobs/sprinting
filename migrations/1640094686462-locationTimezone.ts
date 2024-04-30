import {MigrationInterface, QueryRunner} from 'typeorm';

export class locationTimezone1640094686462 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Location" ADD COLUMN "timezone" CHARACTER VARYING`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Location" DROP COLUMN "timezone"`);
  }
}
