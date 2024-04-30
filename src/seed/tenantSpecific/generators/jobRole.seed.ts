import {JobRole} from '../../../modules/jobRole/jobRole.entity';
import {JobRoleRepository} from '../../../modules/jobRole/jobRole.repository';
import {generateRawSql, executeRawInsert, generateCamelCaseFromText} from '../../utils/seed.utils';
import {Connection} from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import {PlainObject} from '../../../modules/common/common.dto';

export default class JobRoleSeed {
  data: any[] = [];
  repoClass = JobRoleRepository;
  objClass = JobRole;
  name: string = 'JobRole';
  orderNumber = 4;
  singleFind = 'findOne';
  singleFindProps = ['id'];

  forceRebuildFiles: boolean = false;
  insertsPerFile = 50000; // records per file
  currentPlaces: number = 0;
  totalRecords: number = 0;

  async execute(db: Connection) {
    const doExecute = fs.existsSync(path.resolve(__dirname, '../../raw/JobRole-0.sql'));
    console.log('\x1b[33m%s\x1b[0m', `   Seeding ${this.name}`, `// raw sql${doExecute ? '' : ' (skipping)'}`);
    if (doExecute) {
      this.totalRecords = await executeRawInsert(db, this);
    }
  }

  async populateData(data: PlainObject[]): Promise<void> {
    this.data = [];
    let inc: number = 0;
    let file: number = 0;
    let sqlBuffer: string[] = [];
    const nl = `\n`;
    const t = `\t`;
    // eslint-disable-next-line prefer-template
    const stringVal = (val: string) => "'" + val.replace(/'/g, "''") + "'";
    if (fs.existsSync(path.resolve(__dirname, '../../raw/JobRole-0.sql'))) {
      const files = fs.readdirSync(path.resolve(__dirname, '../../raw/'));
      files.forEach((pth) => {
        if (pth.includes('JobRole-') && pth.includes('.sql')) {
          fs.unlink(path.resolve(__dirname, `../../raw/${pth}`), (err) => {
            if (err) {
              throw new Error(err.message);
            }
          });
        }
      });
    }
    for (const [i, item] of data.entries()) {
      sqlBuffer.push(
        `(${stringVal(item.id)}, ${item.tenantId}, ${stringVal(item.name)}, ${item.infoSkillCode}, ${stringVal(
          generateCamelCaseFromText(item.name),
        )}, ${item.rcCategoryId ? stringVal(item.rcCategoryId) : null}, ${!!item.isPesSubject})`,
      );
      if (inc === this.insertsPerFile || (i === data.length - 1 && sqlBuffer.length > 0)) {
        await generateRawSql(
          this.name,
          `INSERT INTO public."JobRole" (id, "tenantId", name, "infoSkillCode", "keyName", "rcCategoryId", "isPesSubject") VALUES${nl}${t}${sqlBuffer.join(
            `,${nl}${t}`,
          )};${nl}`,
          file,
        );
        inc = 0;
        file++;
        sqlBuffer = [];
      }
    }
  }
}
