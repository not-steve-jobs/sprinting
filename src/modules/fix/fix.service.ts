import {INestApplicationContext} from '@nestjs/common';
import {Logger} from 'src/core/logger';
import {Fix} from './fix.entity';
import {FixExecutor} from './fixExecutor.service';

export class FixService {
  constructor(private readonly logger: Logger) {}

  async executePendingFixes(applicationInstance: INestApplicationContext): Promise<Fix[]> {
    const fixExecutor = new FixExecutor(this.logger, applicationInstance);
    return await fixExecutor.executePendingFixes();
  }
}
