import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, addUQ} from './MigrationHelper';

export class PermissionCreate1605860811485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "Permission" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "tenantId" integer NOT NULL,
            "name" character varying(255) NOT NULL,
            "action" character varying(255) NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('Permission', ['id', 'tenantId'])},
            ${addFK('Permission', ['tenantId'], 'Tenant', ['id'])},
            ${addUQ('Permission', ['tenantId', 'name'])}
            )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_Permission_name"
      ON "Permission"("name")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Permission_action"
        ON "Permission"("action")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Permission"`);
  }
}
