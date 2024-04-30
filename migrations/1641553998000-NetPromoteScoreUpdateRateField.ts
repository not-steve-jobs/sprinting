import {MigrationInterface, QueryRunner} from 'typeorm';

export class NetPromoteScoreUpdateRateField1641553998000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "NetPromoteScore" ALTER COLUMN "rate" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "NetPromoteScore" ALTER COLUMN "rate" SET NOT NULL`);
  }
}
