import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addUQ} from './MigrationHelper';

export class LanguageCreate1607693719685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "Language" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" character varying(10) NOT NULL,
        "name" character varying(255) NOT NULL,
        "nativeName" character varying(255) NOT NULL,
        "infoSkillCode" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('Language', ['id'])},
        ${addUQ('Language', ['code'])}
        )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "Language"`, undefined);
  }
}
