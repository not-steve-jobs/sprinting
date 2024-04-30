import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addUQ} from './MigrationHelper';

export class CaseCategoryCreate1600642663617 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "CaseCategory" (
        "id" integer NOT NULL,
        "name" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        ${addPK('CaseCategory', ['id'])},
        ${addUQ('CaseCategory', ['id'])}
        )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "CaseCategory"`, undefined);
  }
}
