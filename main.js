'use strict';

const pg = require('pg');
const { hash } = require('./hash.js');
const bodyParser = require('./body.js');
const http = require('node:http');

const PORT = 8000;

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  user: 'marcus',
  password: 'marcus',
  database: 'example',
});

const listener = (() => [
  PORT,
  () => {
    console.log(`Server is running on port ${PORT}`);
  },
])();

const routing = {
  user: {
    post: async ({ login, password }) => {
      const passwordHash = await hash(password);
      return pool.query(`INSERT INTO users (login, password) VALUES ($1, $2)`, [
        login,
        passwordHash,
      ]);
    },
    get: async (id) => {
      if (!id) {
        const result = await pool.query(`SELECT id, login FROM users`);
        return result.rows;
      }
      const sql = `SELECT id, login FROM users WHERE id = $1`;
      const result = await pool.query(sql, [id]);
      return result.rows[0];
    },
    put: async (id, { login, password }) => {
      const sql = `UPDATE users SET login = $1, password = $2 WHERE id = $3`;
      return pool.query(sql, [login, password, id]);
    },
    delete: async (id) => {
      const sql = `DELETE FROM users WHERE id = $1`;
      return pool.query(sql, [id]);
    },
  },
};

http
  .createServer(async (req, res) => {
    const { method, url, socket } = req;
    const [path, id] = url.substring(1).split('/');
    const entity = routing[path];
    if (!entity) return void res.end('Not found');
    const handler = entity[method.toLowerCase()];
    if (!handler) return void res.end('Method not allowed');
    const src = handler.toString();
    const signature = src.substring(0, src.indexOf(')'));
    const args = [];
    if (signature.includes('id')) args.push(id);
    if (signature.includes('{')) args.push(await bodyParser(req));
    console.log(
      `${socket.remoteAddress} - ${method} ${url} ${args.join(', ')}`,
    );
    const result = await handler(...args);
    res.end(JSON.stringify(result));
  })
  .listen(...listener);
