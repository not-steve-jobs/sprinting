import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, addUQ} from './MigrationHelper';

export class UserCreate1574384688807 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "User" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "clientId" uuid NULL,
      "B2CId" uuid DEFAULT NULL,
      "email" character varying(255) DEFAULT NULL,
      "emailNotifications" BOOLEAN DEFAULT FALSE,
      "clientTraceId" TEXT NOT NULL DEFAULT (CONCAT('CT-', substring(upper(uuid_generate_v4()::text) from 0 for 7))),
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('User', ['id'])},
      ${addFK('User', ['clientId'], 'Client', ['id'])},
      ${addUQ('User', ['B2CId'])},
      ${addUQ('User', ['email'])}
    )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "User"`, undefined);
  }
}
