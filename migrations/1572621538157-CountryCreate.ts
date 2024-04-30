import {MigrationInterface, QueryRunner} from 'typeorm';
import {addPK, addUQ} from './MigrationHelper';

export class CountryCreate1572621538157 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "Country" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "code" character varying(10) NOT NULL,
      "name" character varying(255) NOT NULL,
      "callingCode" character varying(10) NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('Country', ['id'])},
      ${addUQ('Country', ['code'])}
    )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "Country"`, undefined);
  }
}
