'use strict';

const fsp = require('node:fs/promises');
const path = require('node:path');
const pg = require('pg');
const metasql = require('metasql');
const config = require('./config.js');
const console = require('./lib/logger.js')(config.logger.path);

const DB = path.join(process.cwd(), './db');
const SCHEMAS = path.join(process.cwd(), './schemas');

const read = (name) => fsp.readFile(path.join(DB, name), 'utf8');

const execute = async (client, sql) => {
  try {
    await client.query(sql);
  } catch (error) {
    console.error(error);
  }
};

const notEmpty = (s) => s.trim() !== '';

const executeFile = async (client, name) => {
  console.log(`Executing ${name}`);
  const sql = await read(name);
  const commands = sql.split(';\n').filter(notEmpty);
  for (const command of commands) {
    await execute(client, command);
  }
};

const main = async () => {
  await metasql.create(SCHEMAS, DB);
  const dbFile = path.join(DB, 'database.sql');
  const structureFile = path.join(DB, 'structure.sql');
  await fsp.rename(dbFile, structureFile);
  console.log(`Generated typings domain.d.ts`);
  const typesFile = path.join(DB, 'database.d.ts');
  const domainTypes = path.join(DB, 'domain.d.ts');
  await fsp.rename(typesFile, domainTypes);
  const inst = new pg.Client({ ...config.db, ...config.pg });
  await inst.connect();
  await executeFile(inst, 'install.sql');
  console.log('Installed database');
  await inst.end();
  const db = new pg.Client(config.db);
  await db.connect();
  await executeFile(db, 'structure.sql');
  console.log('Installed structure');
  await executeFile(db, 'data.sql');
  console.log('Installed data');
  await db.end();
};
main().catch((err) => console.error(err));
