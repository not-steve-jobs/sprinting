import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK} from './MigrationHelper';

export class EmailNotificationCreate1634195856269 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "EmailNotification" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "type" character varying(255) NOT NULL,
      "email" character varying(255) NOT NULL,
      "payload" jsonb NOT NULL DEFAULT '{}'::jsonb,
      "sendDate" TIMESTAMP WITH TIME ZONE NOT NULL,
      "status" character varying(64) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      ${addPK('EmailNotification', ['id'])}
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "EmailNotification"`);
  }
}
