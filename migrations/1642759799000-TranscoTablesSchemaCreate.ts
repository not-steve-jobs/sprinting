import {MigrationInterface, QueryRunner} from 'typeorm';

export class TranscoTablesSchemaCreate1642759799000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS transformations`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA transformations CASCADE`);
  }
}
