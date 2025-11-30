'use strict';

module.exports = {
  static: {
    port: 8000,
  },
  api: {
    port: 8001,
    transport: 'ws', // http or ws
  },
  sandbox: {
    timeout: 5000,
    displayErrors: false,
  },
  db: {
    host: 'localhost',
    port: 5432,
    user: 'marcus',
    password: 'marcus',
    database: 'example',
  },
  pg: {
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
  },
  logger: {
    path: './log',
  },
};
