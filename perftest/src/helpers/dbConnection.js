// eslint-disable-next-line @typescript-eslint/no-var-requires
const pgp = require('pg-promise')();

const pgConnection = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'clientaccess',
  password: process.env.DB_PASS || 'clientaccess',
  database: process.env.DB_NAME || 'clientaccess',
  ssl: true,
};

module.exports = {
  db: pgp(pgConnection),
};
