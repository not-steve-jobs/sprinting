import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class CaseFollowerCreate1613661845303 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "CaseFollower"
          (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" integer NOT NULL,
        "userId" uuid NOT NULL,
        "caseId" uuid NOT NULL,
        "isCaseRead" boolean NOT NULL,
        "isUserFollower" boolean NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('CaseFollower', ['tenantId', 'id'])},
        ${addFK('CaseFollower', ['tenantId', 'userId'], 'TenantUser', ['tenantId', 'userId'])},
        ${addFK('CaseFollower', ['tenantId', 'caseId'], 'Case', ['tenantId', 'id'])}
        )`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "CaseFollower"`);
  }
}
