import {MigrationInterface, QueryRunner} from 'typeorm';

export class DepartmentFunction1581940983200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "DepartmentFunction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departmentId" uuid, CONSTRAINT "PK_DepartmentFunction" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Department" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_Department" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "DepartmentFunction" ADD CONSTRAINT "FK_DepartmentFunction_Department_departmentId" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "DepartmentFunction" DROP CONSTRAINT "FK_DepartmentFunction_Department_departmentId"`,
    );
    await queryRunner.query(`DROP TABLE "Department"`);
    await queryRunner.query(`DROP TABLE "DepartmentFunction"`);
  }
}
