import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, addUQ} from './MigrationHelper';

export class AvailableWorkersCreate1627548283666 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "AvailableWorkers" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "tenantId" integer NOT NULL,
            "jobRoleId" uuid NOT NULL,
            "availableWorkers" integer default 0,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('AvailableWorkers', ['id'])},
            ${addFK('AvailableWorkers', ['tenantId', 'jobRoleId'], 'JobRole', ['tenantId', 'id'])},
            ${addUQ('AvailableWorkers', ['tenantId', 'jobRoleId'])}
            )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "AvailableWorkers"`);
  }
}
