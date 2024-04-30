import {MigrationInterface, QueryRunner} from 'typeorm';

export class UserUpdate1632465524207 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "User" ADD COLUMN "inactive" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "inactive"`);
  }
}
