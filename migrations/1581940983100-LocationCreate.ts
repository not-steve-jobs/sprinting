import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, addUQ} from './MigrationHelper';

export class LocationCreate1581940983100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "Location" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "clientId" uuid NOT NULL,
            "isMainLocation" BOOLEAN,
            "locationName" character varying(255) NOT NULL,
            "street" character varying(255) DEFAULT NULL,
            "number" character varying(255) NOT NULL,
            "city" character varying(255) DEFAULT NULL,
            "state" character varying(255) DEFAULT NULL,
            "country" character varying(255) DEFAULT NULL,
            "zip" character varying(255) DEFAULT NULL,
            "status" varchar NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('Location', ['id'])},
            ${addFK('Location', ['clientId'], 'Client', ['id'])},
            ${addUQ('Location', ['locationName'])}
            )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_Location_clientId"
      ON "Client"("id")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Location_locationName"
      ON "Location"("locationName")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Location_street"
        ON "Location"("street")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Location_number"
        ON "Location"("number")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Location_city"
        ON "Location"("city")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Location_state"
        ON "Location"("state")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Location_zip"
        ON "Location"("zip")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Location_status"
        ON "Location"("status")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Location"`);
  }
}
