import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class EmploymentTypeCreate1607957884300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "EmploymentType" (
        "id" integer NOT NULL,
        "tenantId" integer NOT NULL,
        "name" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('EmploymentType', ['tenantId', 'id'])},
        ${addFK('EmploymentType', ['tenantId'], 'Tenant', ['id'])}
        )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_EmploymentType_name"
        ON "EmploymentType"("name")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "EmploymentType"`, undefined);
  }
}
