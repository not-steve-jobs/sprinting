import {INestApplicationContext} from '@nestjs/common';
import {Logger} from 'src/core/logger';

/**
 * Fixes should implement this interface.
 */
export interface FixInterface {
  execute(applicationInstance: INestApplicationContext, logger?: Logger): Promise<any>;
}
