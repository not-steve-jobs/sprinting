import {MigrationInterface, QueryRunner} from 'typeorm';

export class LocationUpdate1635950022184 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Location" ALTER COLUMN "number" DROP NOT NULL;`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Location" ALTER COLUMN "number" NOT NULL;`, undefined);
  }
}
