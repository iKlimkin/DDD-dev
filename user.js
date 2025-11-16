'use strict';

const db = require('./db');
const hash = require('./hash');

const users = db('users');

const usersService = {
  async read(id) {
    return await users.read(id, ['id', 'login']);
  },
  async create({ login, password }) {
    const passwordHash = await hash(password);
    return await users.create({ login, password: passwordHash });
  },
  async update(id, { login, password }) {
    const passwordHash = await hash(password);
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
};

module.exports = usersService;
