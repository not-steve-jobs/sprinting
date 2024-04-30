import {MigrationInterface, QueryRunner} from 'typeorm';

export class FileUpdate1638883219000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "File" ADD COLUMN "entityId" uuid DEFAULT NULL`);
    await queryRunner.query(`UPDATE "File" set "entityId" = COALESCE("caseCommentId", "caseId", "jobOrderId")`);
    await queryRunner.query(`ALTER TABLE "File" DROP COLUMN "jobOrderId"`);
    await queryRunner.query(`ALTER TABLE "File" DROP COLUMN "caseId"`);
    await queryRunner.query(`ALTER TABLE "File" DROP COLUMN "caseCommentId"`);
    await queryRunner.query(`ALTER TABLE "File" ADD COLUMN "personId" uuid DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "File" ADD COLUMN "description" text DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "File" ALTER COLUMN "externalId" TYPE varchar`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "File" ADD COLUMN "jobOrderId" uuid DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "File" ADD COLUMN "caseId" uuid DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "File" ADD COLUMN "caseCommentId" uuid DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "File" DROP COLUMN "entityId"`);
    await queryRunner.query(`ALTER TABLE "File" DROP COLUMN "personId"`);
    await queryRunner.query(`ALTER TABLE "File" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "File" ALTER COLUMN "externalId" TYPE uuid`);
  }
}
