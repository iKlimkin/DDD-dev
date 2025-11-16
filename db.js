'use strict';

const pg = require('pg');

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  user: 'marcus',
  password: 'marcus',
  database: 'example',
});

const parseRecord = (record, parser) => {
  const keys = Object.keys(record);
  const nums = Array(keys.length);
  const data = Array(keys.length);
  let i = 0;
  for (const key of keys) {
    data[i] = record[key];
    nums[i] = parser(++i, key);
  }
  return { keys, data, nums };
};

const db = (table) => ({
  async query(sql, args) {
    return pool.query(sql, args);
  },

  async read(id, fields = ['*']) {
    const names = fields.join(', ');
    const sql = `SELECT ${names} FROM ${table}`;
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
    const { keys, nums, data } = parseRecord(record, (i) => `$${i}`);
    const fields = `"${keys.join('", "')}"`;
    const params = nums.join(', ');
    const sql = `INSERT INTO ${table} (${fields}) VALUES (${params}) RETURNING id`;
    const result = await this.query(sql, data);
    return result.rows[0].id;
  },

  async update(id, { ...record }, fields = ['*']) {
    const { nums, data } = parseRecord(record, (i, key) => `${key} = $${i}`);
    const delta = nums.join(', ');
    const sql = `UPDATE ${table} SET ${delta} WHERE id = $${nums.length + 1} RETURNING ${fields.join(', ')}`;
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
