import {MigrationInterface, QueryRunner} from 'typeorm';

export class AlterJobRoleTableAddPesField1644408878981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobRole" ADD COLUMN "isPesSubject" boolean DEFAULT false;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobRole" DROP COLUMN "isPesSubject";`);
  }
}
