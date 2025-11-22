const db = require('../db.js').db;
const users = db('users');

const userService = {
  async read(id) {
    return await users.read(id, ['id', 'login']);
  },
  async create({ login, password }) {
    const passwordHash = await common.hash(password);
    return await users.create({ login, password: passwordHash });
  },
  async update(id, { login, password }) {
    const passwordHash = await common.hash(password);
    const exist = await users.read(id, ['id']);
    if (!exist) throw new Error('User not found');
    return await users.update(id, { login, password: passwordHash }, [
      'id',
      'login',
    ]);
  },
  async delete(id) {
    return await users.delete(id);
  },
  async find(mask) {
    const sql = `SELECT id, login FROM users WHERE login LIKE $1`;
    const result = await users.query(sql, [`%${mask}%`]);
    return result.rows;
  },
};

module.exports = userService;
