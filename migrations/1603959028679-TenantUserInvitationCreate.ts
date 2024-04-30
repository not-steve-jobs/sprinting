import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addFK, addUQ} from './MigrationHelper';

export class TenantUserInvitationCreate1603959028679 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "TenantUserInvitation" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" integer NOT NULL,
        "userId" uuid NOT NULL,
        "email" text NOT NULL,
        "invitationLink" text NOT NULL,
        "dateExpiry" TIMESTAMP DEFAULT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
        "acceptedAt" TIMESTAMP NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('TenantUserInvitation', ['id', 'tenantId'])},
        ${addFK('TenantUserInvitation', ['tenantId', 'userId'], 'TenantUser', ['tenantId', 'userId'])},
        ${addUQ('TenantUserInvitation', ['tenantId', 'userId', 'email', 'dateExpiry'])}
        )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_TenantUserInvitation_email"
          ON "TenantUserInvitation"("email")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_TenantUserInvitation_dateExpiry"
          ON "TenantUserInvitation"("dateExpiry")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "TenantUserInvitation"`, undefined);
  }
}
