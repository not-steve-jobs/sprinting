import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class RoleCreate1589382291436 implements MigrationInterface {
  name = 'RoleCreate1589382291436';
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'Role',
        columns: [
          {
            name: 'id',
            type: 'integer',
            comment: 'Role Id',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'text',
            comment: 'Role Name',
            isUnique: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            comment: 'Timestamp of creation',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            comment: 'Timestamp of creation',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('Role');
  }
}
