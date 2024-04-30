import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class CaseCreate1600642663618 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Case"
        (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "tenantId" integer NOT NULL,
      "userId" uuid NOT NULL,
      "locationId" uuid DEFAULT NULL,
      "statusId" integer DEFAULT NULL,
      "caseCategoryId" integer NOT NULL,
      "entityId" uuid DEFAULT NULL,
      "entityName" character varying(255) NOT NULL,
      "description" varchar NOT NULL,
      "subject" varchar NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      ${addPK('Case', ['id', 'tenantId'])},
      ${addFK('Case', ['tenantId', 'userId'], 'TenantUser', ['tenantId', 'userId'])},
      ${addFK('Case', ['locationId'], 'Location', ['id'])},
      ${addFK('Case', ['tenantId', 'statusId'], 'Status', ['tenantId', 'id'])},
      ${addFK('Case', ['caseCategoryId'], 'CaseCategory', ['id'])}
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Case"`);
  }
}
