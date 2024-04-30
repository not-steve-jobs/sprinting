import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class BranchCreate1607564996735 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Branch" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "tenantId" integer NOT NULL,
            "status" varchar NOT NULL,
            "name" character varying(255) NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            ${addPK('Branch', ['tenantId', 'id'])},
            ${addFK('Branch', ['tenantId'], 'Tenant', ['id'])}
            )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Branch_name"
            ON "Branch"("name")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Branch"`, undefined);
  }
}
