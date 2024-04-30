import {MigrationInterface, QueryRunner} from 'typeorm';

export class UserProfileUpdate1646227451085 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "UserProfile" ALTER COLUMN "mainLocationId" DROP NOT NULL;`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "UserProfile" ALTER COLUMN "mainLocationId" NOT NULL;`, undefined);
  }
}
