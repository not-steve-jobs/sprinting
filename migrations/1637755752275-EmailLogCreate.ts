import {MigrationInterface, QueryRunner} from 'typeorm';

import {addPK} from './MigrationHelper';

export class EmailLogCreate1637755752275 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "EmailLog" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "messageKey" character varying(32) NOT NULL,
      "request" jsonb NOT NULL DEFAULT '{}'::jsonb,
      "response" jsonb NOT NULL DEFAULT '{}'::jsonb,
      "status" character varying(64) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      ${addPK('EmailLog', ['id'])}
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "EmailLog"`);
  }
}
