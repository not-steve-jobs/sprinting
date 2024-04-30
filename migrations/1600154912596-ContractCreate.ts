import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, addUQ} from './MigrationHelper';

export class ContractCreate1600154912596 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "Contract" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "tenantId" integer NOT NULL,
            "locationId" uuid DEFAULT NULL,
            "statusId" integer DEFAULT NULL,
            "number" character varying(255) NOT NULL,
            "dateStart"  TIMESTAMP DEFAULT NULL,
            "dateEnd"  TIMESTAMP DEFAULT NULL,
            "signatureDate" TIMESTAMP DEFAULT NULL,
            "associateName" character varying(255) DEFAULT NULL,
            "typeId" integer DEFAULT NULL,
            "service" character varying(100) DEFAULT NULL,
            "legalEntity" character varying(255) DEFAULT NULL,
            "signedBy" character varying(255) DEFAULT NULL,
            "serviceType" character varying(255) DEFAULT NULL,
            "roleOfThePersonSign" character varying(255) DEFAULT NULL,
            "clientsName" character varying(255) DEFAULT NULL,
            "VAT" character varying(255) DEFAULT NULL,
            "mainPointOfContract" character varying(255) DEFAULT NULL,
            "mainPointForInvoice" character varying(255) DEFAULT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('Contract', ['tenantId', 'id'])},
            ${addFK('Contract', ['tenantId'], 'Tenant', ['id'])},
            ${addFK('Contract', ['locationId'], 'Location', ['id'])},
            ${addFK('Contract', ['tenantId', 'statusId'], 'Status', ['tenantId', 'id'])},
            ${addFK('Contract', ['tenantId', 'typeId'], 'Type', ['tenantId', 'id'])},
            ${addUQ('Contract', ['tenantId', 'number'])}
      )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_Contract_tenantId"
          ON "Contract"("tenantId")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Contract_number"
        ON "Contract"("number")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Contract_locationId"
          ON "Contract"("locationId")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Contract_dateStart"
          ON "Contract"("dateStart")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Contract_dateEnd"
          ON "Contract"("dateEnd")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Contract_statusId"
          ON "Contract"("statusId")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Contract_signatureDate"
          ON "Contract"("signatureDate")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "Contract"`);
  }
}
