import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK} from './MigrationHelper';

export class BusMessageCreate1620736245543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "BusMessage" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "scope" character varying(255) NOT NULL,
            "direction" character varying(255) NOT NULL,
            "messageName" character varying(255) NOT NULL,
            "messageId" uuid NOT NULL,
            "type" character varying(20) NOT NULL,
            "payload" jsonb NOT NULL DEFAULT '{}'::jsonb,
            "status" character varying(20) DEFAULT NULL,
            "response" jsonb NOT NULL DEFAULT '{}'::jsonb,
            "internalError" text DEFAULT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('BusMessage', ['id'])}
            )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_BusMessage_scope"
          ON "BusMessage"("scope")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BusMessage_direction"
          ON "BusMessage"("direction")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BusMessage_messageName"
          ON "BusMessage"("messageName")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BusMessage_messageId"
          ON "BusMessage"("messageId")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BusMessage_type"
          ON "BusMessage"("type")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_BusMessage_status"
          ON "BusMessage"("status")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "BusMessage"`);
  }
}
