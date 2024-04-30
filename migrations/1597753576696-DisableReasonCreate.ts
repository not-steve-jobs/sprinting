import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addUQ} from './MigrationHelper';

export class DisableReasonCreate1597753576696 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "DisableReason" (
        "id" integer NOT NULL,
        "reason" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('DisableReason', ['id'])},
        ${addUQ('DisableReason', ['reason'])}
        )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_DisableReason_reason"
        ON "DisableReason"("reason")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "DisableReason"`, undefined);
    await queryRunner.query(`DROP INDEX
    "IDX_DisableReason_reason"`);
  }
}
