'use strict';

const express = require('express');
const pg = require('pg');
const { hash, verify } = require('./hash.js');

const PORT = 8000;

const app = express();
app.use(express.json());

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  user: 'marcus',
  password: 'marcus',
  database: 'example',
});

const methods = {
  get: {
    '/users': (req, res) => {
      console.log(`${req.socket.remoteAddress} - ${req.method} ${req.url}`);
      pool.query(`SELECT * FROM users`, (err, data) => {
        if (err) throw err;
        res.status(200).json(data.rows.map(({ id, login }) => ({ id, login })));
      });
    },
    '/user/:id': (req, res) => {
      const id = parseInt(req.params.id, 10);
      console.log(
        `${req.socket.remoteAddress} - ${req.method} ${req.url} ${id}`,
      );
      pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, data) => {
        if (err) throw err;
        res.status(200).json(data.rows.map(({ id, login }) => ({ id, login })));
      });
    },
  },
  post: {
    '/user': async (req, res) => {
      const { login, password } = req.body;
      console.log(
        `${req.socket.remoteAddress} - ${req.method} ${req.url} ${login}`,
      );
      const sql = `INSERT INTO users (login, password) VALUES ($1, $2)`;
      const passwordHash = await hash(password);
      pool.query(sql, [login, passwordHash], (err, data) => {
        if (err) throw err;
        res.status(200).json({ created: data.rowCount });
      });
    },
  },
  put: {
    '/user/:id': (req, res) => {
      const id = parseInt(req.params.id, 10);
      const { login, password } = req.body;
      console.log(
        `${req.socket.remoteAddress} - ${req.method} ${req.url} ${id}`,
      );
      const sqlSelect = `SELECT password FROM users WHERE id = $1`;
      pool.query(sqlSelect, [id], async (err, data) => {
        if (err) throw err;
        if (!data.rowCount) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        const existingHash = data.rows[0].password;
        const valid = await verify(password, existingHash);
        if (!valid) {
          res.status(401).json({ error: 'Invalid password' });
          return;
        }
        const newPasswordHash = await hash(password);
        const sqlUpdate = `UPDATE users SET login = $1, password = $2 WHERE id = $3`;
        pool.query(sqlUpdate, [login, newPasswordHash, id], (err, data) => {
          if (err) throw err;
          res.status(200).json({ id, updated: data.rowCount });
        });
      });
    },
  },
  delete: {
    '/user/:id': (req, res) => {
      const id = parseInt(req.params.id, 10);
      const { password } = req.body;
      console.log(
        `${req.socket.remoteAddress} - ${req.method} ${req.url} ${id}`,
      );
      const selectSql = `SELECT password FROM users WHERE id = $1`;
      pool.query(selectSql, [id], async (err, data) => {
        if (err) throw err;
        if (!data.rowCount) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        const existingHash = data.rows[0].password;
        const valid = await verify(password, existingHash);
        if (!valid) {
          res.status(401).json({ error: 'Invalid password' });
          return;
        }
        const sql = `DELETE FROM users WHERE id = $1`;
        pool.query(sql, [id], (err, data) => {
          if (err) throw err;
          res.status(200).json({ deleted: data.rowCount });
        });
      });
    },
  },
};

Object.entries(methods).forEach(([method, routes]) => {
  Object.entries(routes).forEach(([path, handler]) => {
    app[method](path, async (req, res) => {
      console.log(`${req.socket.remoteAddress} - ${req.method} ${req.url}`);
      await handler(req, res);
    });
  });
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is running on port ${PORT}`);
});
