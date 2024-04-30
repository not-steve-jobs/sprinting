import {addPK, addFK} from './MigrationHelper';
import {MigrationInterface, QueryRunner} from 'typeorm';

export class WorkplaceCreate1642147689649 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Workplace" (
            "locationId" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "parentLocationId" uuid NOT NULL DEFAULT uuid_generate_v4(),

            "workEnvironment" character varying(255) DEFAULT NULL,
            "wifiId" character varying(255) DEFAULT NULL,
            "qrCode" character varying(255) DEFAULT NULL,
            "status" character varying(255) NOT NULL,

            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),

            ${addPK('Workplace', ['locationId'])},
            ${addFK('Workplace', ['locationId'], 'Location', ['id'])},
            ${addFK('Workplace', ['parentLocationId'], 'Location', ['id'])}
        )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Workplace"`);
  }
}
