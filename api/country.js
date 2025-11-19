const country = db('country');

({
  async create({ name }) {
    return await country.create({ name });
  },

  async read(id) {
    return await country.read(id, ['id', 'name']);
  },

  async find(mask) {
    const sql = `SELECT id, name FROM countries WHERE name LIKE $1`;
    const result = await country.query(sql, [`%${mask}%`]);
    return result.rows;
  },
});
