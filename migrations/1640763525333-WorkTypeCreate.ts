import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class WorkTypeCreate1640763525333 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "WorkType" (
            "id" integer NOT NULL,
            "tenantId" integer NOT NULL,
            "name" character varying(255) NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            ${addPK('WorkType', ['id', 'tenantId'])},
            ${addFK('WorkType', ['tenantId'], 'Tenant', ['id'])}
        )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "WorkType"`);
  }
}
