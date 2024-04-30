import {INestApplicationContext} from '@nestjs/common';
import {Logger} from 'src/core/logger';
import {Connection, getFromContainer, ObjectLiteral, QueryRunner, Table} from 'typeorm';
import {Fix} from './fix.entity';
import {FixInterface} from './fix.interface';
import {importClassesFromDirectories} from './fix.util';
import fs from 'fs';

export class FixExecutor {
  private readonly fixesTableName: string = 'fixes';
  protected connection: Connection;

  constructor(private readonly logger: Logger, protected applicationInstance: INestApplicationContext) {
    this.connection = applicationInstance.get<Connection>(Connection);
  }

  async executePendingFixes(): Promise<Fix[]> {
    this.logger.info(__filename, `Execute Pending Fixes`);

    const queryRunner = this.connection.createQueryRunner();

    await this.createFixesTableIfNotExist(queryRunner);

    const executedFixes = await this.loadExecutedFixes(queryRunner);

    const codeFixes: Fix[] = this.getCodeFixes();

    const pendingFixes = codeFixes.filter((fix) => {
      return !executedFixes.find((executedFix) => executedFix.name === fix.name);
    });
    this.logger.info(__filename, `Found ${pendingFixes.length} pending fixes`);

    if (!pendingFixes.length) {
      return [];
    }

    const successFixes: Fix[] = [];

    for (const fix of pendingFixes) {
      this.logger.info(__filename, `${fix.name} started`);
      if (fix.instance) {
        // in this way each fix will be independent and it will not stop execution of other fixes
        try {
          await fix.instance.execute(this.applicationInstance, this.logger);
          await this.insertExecutedFix(queryRunner, fix);
          successFixes.push(fix);
        } catch (error) {
          this.logger.error(__filename, `General fix error: ${fix.name}`, error);
        }
      }
    }

    this.logger.info(__filename, `${successFixes.length} success fixes`);

    return successFixes;
  }

  protected async createFixesTableIfNotExist(queryRunner: QueryRunner): Promise<void> {
    const tableExist = await queryRunner.hasTable(this.fixesTableName);
    this.logger.info(__filename, `${this.fixesTableName} table exists: ${tableExist}`);
    if (!tableExist) {
      this.logger.info(__filename, `Creating ${this.fixesTableName} table`);
      await queryRunner.createTable(
        new Table({
          name: this.fixesTableName,
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isGenerated: true,
              generationStrategy: 'uuid',
              isPrimary: true,
              isNullable: false,
            },
            {
              name: 'timestamp',
              type: this.connection.driver.normalizeType({
                type: this.connection.driver.mappedDataTypes.migrationTimestamp,
              }),
              isPrimary: false,
              isNullable: false,
            },
            {
              name: 'name',
              type: this.connection.driver.normalizeType({
                type: this.connection.driver.mappedDataTypes.migrationName,
              }),
              isNullable: false,
            },
            {
              name: 'runAt',
              type: this.connection.driver.normalizeType({
                type: this.connection.driver.mappedDataTypes.migrationTimestamp,
              }),
              isPrimary: false,
              isNullable: false,
            },
          ],
        }),
      );
    }
  }

  protected async loadExecutedFixes(queryRunner: QueryRunner): Promise<Fix[]> {
    const fixesRaw: ObjectLiteral[] = await this.connection.manager
      .createQueryBuilder(queryRunner)
      .select()
      .orderBy(this.connection.driver.escape('id'), 'DESC')
      .from(this.fixesTableName, this.fixesTableName)
      .getRawMany();

    this.logger.info(__filename, `Found ${fixesRaw.length} executed fixes`);

    return fixesRaw.map((fixRaw) => {
      return new Fix(fixRaw['id'], parseInt(fixRaw['timestamp']), fixRaw['name'], fixRaw['runAt']);
    });
  }

  protected getCodeFixes(): Fix[] {
    const fixFiles = importClassesFromDirectories(`./${fs.existsSync('./dist') ? 'dist/' : ''}fixes/`);
    const fixClasses = fixFiles.map((fixClass) => getFromContainer<FixInterface>(fixClass));
    const fixes = fixClasses.map((fix) => {
      const fixClassName = (fix.constructor as any).name;
      const fixTimestamp = parseInt(fixClassName.substr(-13), 10);
      if (!fixTimestamp || isNaN(fixTimestamp)) {
        throw new Error(
          `${fixClassName} fix name is wrong. Fix class name should have a JavaScript timestamp appended.`,
        );
      }
      return new Fix(undefined, fixTimestamp, fixClassName, 0, fix);
    });

    this.checkForDuplicateFixes(fixes);

    this.logger.info(__filename, `Found ${fixes.length} code fixes`);

    return fixes.sort((a, b) => a.timestamp - b.timestamp);
  }

  protected checkForDuplicateFixes(fixes: Fix[]) {
    const fixNames = fixes.map((fix) => fix.name);
    const duplicates = Array.from(new Set(fixNames.filter((fixName, index) => fixNames.indexOf(fixName) < index)));
    if (duplicates.length > 0) {
      throw Error(`Duplicate fixes: ${duplicates.join(', ')}`);
    }
  }

  protected async insertExecutedFix(queryRunner: QueryRunner, fix: Fix): Promise<void> {
    const values: ObjectLiteral = {};
    values['timestamp'] = fix.timestamp;
    values['name'] = fix.name;
    values['runAt'] = Date.now();
    const qb = queryRunner.manager.createQueryBuilder();
    await qb.insert().into(this.fixesTableName).values(values).execute();
  }
}
