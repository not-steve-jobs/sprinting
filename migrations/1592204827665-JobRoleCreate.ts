import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class JobRoleCreate1592204827665 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "JobRole" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "tenantId" integer NOT NULL,
      "name" text NOT NULL,
      "colorId" INTEGER,
      "infoSkillCode" VARCHAR NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      ${addPK('JobRole', ['tenantId', 'id'])},
      ${addFK('JobRole', ['tenantId'], 'Tenant', ['id'])}
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "JobRole"`);
  }
}
