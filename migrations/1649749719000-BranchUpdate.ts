import {MigrationInterface, QueryRunner} from 'typeorm';

export class BranchUpdate1649749719000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Branch" ADD COLUMN "branchCostCenter" character varying(255) DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Branch" DROP COLUMN "branchCostCenter"`);
  }
}
