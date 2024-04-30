import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobOrderAssociateAddInterviewDate1633507788140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "JobOrderAssociate" ADD COLUMN "interviewDate" TIMESTAMP WITH TIME ZONE DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrderAssociate" DROP COLUMN "interviewDate"`);
  }
}
