import {MigrationInterface, QueryRunner} from 'typeorm';

export class BIUserLocations1638885759721 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE OR REPLACE VIEW public."BI_UserLocations"
                  AS
                  SELECT "Location".id,
                     "User".email AS "userName"
                    FROM "User"
                      JOIN "Client" ON "User"."clientId" = "Client"."id"
                      JOIN "Location" ON "Client"."id" = "Location"."clientId"`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP VIEW "BI_UserLocations"`, undefined);
  }
}
