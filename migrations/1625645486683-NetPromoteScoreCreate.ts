import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class NetPromoteScoreCreate1625645486683 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "NetPromoteScore" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "tenantId" integer NOT NULL,
      "userId" uuid NOT NULL,
      "rate" integer NOT NULL,
      "comment" text,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('NetPromoteScore', ['id', 'tenantId'])},
      ${addFK('NetPromoteScore', ['userId'], 'User', ['id'])},
      ${addFK('NetPromoteScore', ['tenantId'], 'Tenant', ['id'])}
    )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('NetPromoteScore');
  }
}
