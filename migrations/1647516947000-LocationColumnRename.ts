import {MigrationInterface, QueryRunner} from 'typeorm';

export class LocationColumnRename1647516947000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Location" RENAME COLUMN "externalLocationlId" TO "externalLocationId";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Location" RENAME COLUMN "externalLocationId" TO "externalLocationlId";`);
  }
}
