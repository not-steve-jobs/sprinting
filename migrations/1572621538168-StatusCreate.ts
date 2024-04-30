import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addFK} from './MigrationHelper';

export class StatusCreate1572621538168 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Status" (
        "id" integer NOT NULL,
        "tenantId" integer NOT NULL,
        "entityName" character varying(255) NOT NULL,
        "name" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('Status', ['tenantId', 'id'])},
        ${addFK('Status', ['tenantId'], 'Tenant', ['id'])}
        )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Status_entityName"
        ON "Status"("entityName")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Status_name"
          ON "Status"("name")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Status"`, undefined);
  }
}
