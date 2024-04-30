import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, addUQ} from './MigrationHelper';

export class ClientProfileCreate1605538660511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ClientProfile" (
      "id" uuid NOT NULL,
      "businessName" character varying(255) NOT NULL,
      "number" character varying(255) DEFAULT NULL,
      "email" character varying(255) DEFAULT NULL,
      "phone" character varying(255) DEFAULT NULL,
      "phonePrefix" character varying(255) DEFAULT NULL,
      "web" character varying(255) DEFAULT NULL,
      "VAT" character varying(255) DEFAULT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('ClientProfile', ['id'])},
      ${addFK('ClientProfile', ['id'], 'Client', ['id'])},
      ${addUQ('ClientProfile', ['businessName', 'email'])}
      )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ClientProfile"`, undefined);
  }
}
