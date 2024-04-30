import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobOrderUpdate1630407824680 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JobOrder" ALTER COLUMN "dateStart" TYPE TIMESTAMP WITH TIME ZONE;`,
      undefined,
    );
    await queryRunner.query(`ALTER TABLE "JobOrder" ALTER COLUMN "dateEnd" TYPE TIMESTAMP WITH TIME ZONE;`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" ALTER COLUMN "dateStart" TYPE TIMESTAMP;`, undefined);
    await queryRunner.query(`ALTER TABLE "JobOrder" ALTER COLUMN "dateEnd" TYPE TIMESTAMP;`, undefined);
  }
}
