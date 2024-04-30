import {MigrationInterface, QueryRunner} from 'typeorm';
import {addUQ, uqName} from './MigrationHelper';

export class LocationDropUniqueName1642160866279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Location" DROP CONSTRAINT ${uqName('Location', ['locationName'])}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Location" ${addUQ('Location', ['locationName'])}`);
  }
}
