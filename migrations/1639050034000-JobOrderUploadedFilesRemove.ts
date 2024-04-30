import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobOrderUploadedFilesRemove1639050034000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" DROP COLUMN "uploadedFiles"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrder" ADD COLUMN "uploadedFiles" jsonb NOT NULL DEFAULT '[]'::jsonb`);
  }
}
