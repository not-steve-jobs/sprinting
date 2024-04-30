import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK, addUQ} from './MigrationHelper';

export class InvoiceCreate1600959264613 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "Invoice" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "tenantId" integer NOT NULL,
            "number" character varying(255) NOT NULL,
            "locationId" uuid DEFAULT NULL,
            "issueDate" TIMESTAMP DEFAULT NULL,
            "totalAmount" integer DEFAULT NULL,
            "hoursBilled" integer DEFAULT NULL,
            "statusId" integer DEFAULT NULL,
            "duePaymentDate" TIMESTAMP DEFAULT NULL,
            "attachments" character varying(100) DEFAULT NULL,
            "periodStart" TIMESTAMP DEFAULT NULL,
            "periodEnd" TIMESTAMP DEFAULT NULL,
            "creditNotes" character varying(100) DEFAULT NULL,
            "currency" character varying(30) DEFAULT NULL,
            "amountBeforeTax" integer DEFAULT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ${addPK('Invoice', ['tenantId', 'id'])},
            ${addFK('Invoice', ['tenantId'], 'Tenant', ['id'])},
            ${addFK('Invoice', ['locationId'], 'Location', ['id'])},
            ${addFK('Invoice', ['tenantId', 'statusId'], 'Status', ['tenantId', 'id'])},
            ${addUQ('Invoice', ['tenantId', 'number'])}
      )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_Invoice_tenantId"
              ON "Invoice"("tenantId")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Invoice_number"
            ON "Invoice"("number")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Invoice_locationId"
          ON "Invoice"("locationId")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Invoice_periodStart"
              ON "Invoice"("periodStart")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Invoice_periodEnd"
              ON "Invoice"("periodEnd")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Invoice_hoursBilled"
              ON "Invoice"("hoursBilled")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Invoice_statusId"
              ON "Invoice"("statusId")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Invoice_attachments"
              ON "Invoice"("attachments")`,
      undefined,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "Invoice"`);
  }
}
