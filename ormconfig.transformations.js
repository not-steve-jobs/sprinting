import * as DEFAULT_TYPEORM_CONFIG from './ormconfig'

// By default TypeORM drops only the default "public schema" so we need a separate config file to make it drop all schemas
module.exports = {
  ...DEFAULT_TYPEORM_CONFIG,
  schema: 'transformations'
};
