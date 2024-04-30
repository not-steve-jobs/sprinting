import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addUQ} from './MigrationHelper';

export class LevelCreate1607687000826 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Level" (
        "id" integer NOT NULL,
        "entityName" character varying(255) NOT NULL,
        "name" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        ${addPK('Level', ['id'])},
        ${addUQ('Level', ['entityName', 'name'])}
        )`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Level_entityName"
        ON "Level"("entityName")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Level_name"
          ON "Level"("name")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Level"`, undefined);
  }
}
