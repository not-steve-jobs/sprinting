import {MigrationInterface, QueryRunner} from 'typeorm';

export class CurrencyCreate1586940056000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "Currency" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "code" character varying(10) NOT NULL,
      "name" character varying(255) NOT NULL,
      "symbol" character varying(30) NOT NULL,
      "space" boolean NOT NULL,
      "suffix" boolean NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_Currency_id" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_Currency_code" UNIQUE ("code"))
    `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "Currency"`, undefined);
  }
}
