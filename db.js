'use strict';

const pg = require('pg');

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  user: 'marcus',
  password: 'marcus',
  database: 'example',
});

const db = (table) => ({
  async query(sql, args) {
    return pool.query(sql, args);
  },

  async read(id, fields = ['*']) {
    const names = fields.join(', ');
    const sql = `SELECT ${names}  FROM ${table}`;
    // eslint-disable-next-line no-unused-vars
    const mapper = ({ password, ...row }) => row;
    if (!id) {
      const result = await this.query(sql);
      return result.rows.map(mapper);
    }
    const result = await this.query(`${sql} WHERE id = $1`, [id]);
    return result.rows.map(mapper).at(0);
  },

  async create({ ...record }) {
    const keys = Object.keys(record);
    const nums = Array(keys.length);
    const data = Array(keys.length);
    let i = 0;
    for (const key of keys) {
      data[i] = record[key];
      nums[i] = `$${++i}`;
    }
    console.log('keys', keys);
    const fields = `"${keys.join('", "')}"`;
    console.log('fields', fields);
    const params = nums.join(', ');
    const sql = `INSERT INTO ${table} (${fields}) VALUES (${params}) RETURNING id`;
    const result = await this.query(`${sql}`, data);
    return result.rows[0].id;
  },

  async update(id, { ...record }) {
    const keys = Object.keys(record);
    const updates = Array(keys.length);
    const data = Array(keys.length);
    let i = 0;
    for (const key of keys) {
      data[i] = record[key];
      updates[i] = `${key} = $${++i}`;
    }
    const delta = updates.join(', ');
    const sql = `UPDATE ${table} SET ${delta} WHERE id = $${++i} RETURNING id, login`;
    data.push(id);
    const result = await this.query(sql, data);
    return result.rows[0];
  },

  async delete(id) {
    const sql = `DELETE FROM ${table} WHERE id = $1 RETURNING id, login`;
    const result = await this.query(sql, [id]);
    return result.rows[0];
  },
});

module.exports = db;
