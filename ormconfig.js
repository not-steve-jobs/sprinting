/*
 *  NOTE: This file appears unused. This configuration is ignored in AppModule.
 *        If anyone knows if this is used at any point, please replace this comment
 *        with an explanation.
 */

const loadEnv = (env) => require('dotenv').config({path: `${env}`});
loadEnv(`.env.${process.env.NODE_ENV}.local`);
loadEnv(`.env.local`);
loadEnv(`.env.${process.env.NODE_ENV}`);
loadEnv(`.env`);

const path = require('path');
const envConfigFile = require(path.resolve(__dirname, `./config/${process.env.NODE_ENV}`));

module.exports = {
  type: 'postgres',
  ...envConfigFile().dbConfig,
  entities: ['dist/*.entity{.ts,.js}'],
  migrations: ['migrations/[1234567890]*.ts'],
  synchronize: false,
  cli: {
    migrationsDir: 'migrations',
  },
};
