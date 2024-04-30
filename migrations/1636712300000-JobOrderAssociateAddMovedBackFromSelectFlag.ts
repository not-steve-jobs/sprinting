import {MigrationInterface, QueryRunner} from 'typeorm';

export class JobOrderAssociateAddMovedBackFromSelectFlag1636712300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrderAssociate" ADD COLUMN "movedBackFromSelect" boolean DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "JobOrderAssociate" DROP COLUMN "movedBackFromSelect"`);
  }
}
