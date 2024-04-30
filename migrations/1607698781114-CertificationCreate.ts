import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, addUQ} from './MigrationHelper';

export class CertificationCreate1607698781114 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Certification" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" integer NOT NULL,
        "name" character varying(255) NOT NULL,
        "infoSkillCode" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('Certification', ['tenantId', 'id'])},
        ${addUQ('Certification', ['id'])},
        ${addFK('Certification', ['tenantId'], 'Tenant', ['id'])}
        )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Certification_name"
        ON "Certification"("name")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Certification"`, undefined);
  }
}
