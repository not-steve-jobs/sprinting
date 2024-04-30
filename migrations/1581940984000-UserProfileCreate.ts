import {MigrationInterface, QueryRunner} from 'typeorm';
import {addFK, addPK} from './MigrationHelper';

export class UserProfileCreate1581940984000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "UserProfile" (
      "id" uuid NOT NULL,
      "mainLocationId" uuid NOT NULL,
      "departmentId" uuid DEFAULT NULL,
      "departmentFunctionId" uuid DEFAULT NULL,
      "firstName" character varying(255) DEFAULT NULL,
      "lastName" character varying(255) DEFAULT NULL,
      "title" character varying(255) DEFAULT NULL,
      "phonePrefix" character varying(15) DEFAULT NULL,
      "phone" character varying(255) DEFAULT NULL,
      "otherPhone" character varying(255) DEFAULT NULL,
      "otherPhonePrefix" character varying(15) DEFAULT NULL,
      "language" character varying(255) DEFAULT NULL,
      "worksite" character varying(255) DEFAULT NULL,
      "dataAccess" BOOLEAN DEFAULT NULL,
      "profileImageUrl" varchar DEFAULT NULL,
      "customDepartment" text DEFAULT NULL,
      "preferences" jsonb NOT NULL DEFAULT '{}'::jsonb,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      ${addPK('UserProfile', ['id'])},
      ${addFK('UserProfile', ['id'], 'User', ['id'])},
      ${addFK('UserProfile', ['mainLocationId'], 'Location', ['id'])},
      ${addFK('UserProfile', ['departmentId'], 'Department', ['id'])},
      ${addFK('UserProfile', ['departmentFunctionId'], 'DepartmentFunction', ['id'])}
      )`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "UserProfile"`, undefined);
  }
}
