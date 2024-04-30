import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, addUQ} from './MigrationHelper';

export class TypeCreate1597753576695 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Type" (
        "id" integer NOT NULL,
        "tenantId" integer NOT NULL,
        "entityName" character varying(255) NOT NULL,
        "name" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('Type', ['tenantId', 'id'])},
        ${addFK('Type', ['tenantId'], 'Tenant', ['id'])},
        ${addUQ('Type', ['entityName', 'name', 'tenantId'])}
        )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Type_entityName"
        ON "Type"("entityName")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Type_name"
          ON "Type"("name")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Type"`, undefined);
  }
}
