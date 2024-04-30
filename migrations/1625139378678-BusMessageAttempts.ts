import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class BusMessageAttempts1625139378678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "BusMessageAttempts" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "busMessageId" uuid NOT NULL,
            "status" character varying(20) DEFAULT NULL,
            "response" jsonb NOT NULL DEFAULT '{}'::jsonb,
            "internalError" text DEFAULT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('BusMessageAttempts', ['id'])},
            ${addFK('BusMessageAttempts', ['busMessageId'], 'BusMessage', ['id'])}
            )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_BusMessageAttempts_status"
                    ON "BusMessageAttempts"("status")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "BusMessageAttempts"`);
  }
}
