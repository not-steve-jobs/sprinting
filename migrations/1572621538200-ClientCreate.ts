import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class ClientCreate1572621538200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "Client" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "countryId" uuid NOT NULL,
      "name" text NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      ${addPK('Client', ['id'])},
      ${addFK('Client', ['countryId'], 'Country', ['id'])}
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "Client"`);
  }
}
