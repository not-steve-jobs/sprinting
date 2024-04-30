import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class UserConsentCreate1605823493213 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "UserConsent" (
      "tenantId" integer NOT NULL,
      "userId" uuid NOT NULL,
      "consentId" uuid NOT NULL,
      "isAccepted" BOOLEAN DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('UserConsent', ['userId', 'tenantId', 'consentId'])},
      ${addFK('UserConsent', ['userId'], 'User', ['id'])},
      ${addFK('UserConsent', ['consentId', 'tenantId'], 'Consent', ['id', 'tenantId'])}
    )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('UserConsent');
  }
}
