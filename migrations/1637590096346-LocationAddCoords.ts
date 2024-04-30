import {MigrationInterface, QueryRunner} from 'typeorm';

export class LocationAddCoords1637590096346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Location" ADD COLUMN "lat" numeric DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "Location" ADD COLUMN "lng" numeric DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Location" DROP COLUMN "lat"`);
    await queryRunner.query(`ALTER TABLE "Location" DROP COLUMN "lng"`);
  }
}
