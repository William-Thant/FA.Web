const db = require('./db');

async function getAll() {
  const [rows] = await db.query('SELECT * FROM cars ORDER BY CarID ASC');
  return rows;
}

async function getAvailable(searchTerm) {
  const searchFilter = (searchTerm || '').toString().toLowerCase();

  let sql = 'SELECT * FROM cars WHERE Availability = ?';
  const params = ['available'];

  if (searchFilter) {
    sql += ' AND (LOWER(Model) LIKE ? OR LOWER(Brand) LIKE ?)';
    params.push(`%${searchFilter}%`, `%${searchFilter}%`);
  }

  sql += ' ORDER BY CarID ASC';

  const [rows] = await db.query(sql, params);
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM cars WHERE CarID = ? LIMIT 1', [id]);
  return rows[0];
}

async function addCar(payload) {
  const [result] = await db.query(
    'INSERT INTO cars (Model, Brand, Price, DealerID, Availability) VALUES (?, ?, ?, ?, ?)',
    [
      payload.Model || 'Untitled',
      payload.Brand || 'Unknown',
      payload.Price || 0,
      payload.DealerID || 1,
      'available'
    ]
  );

  return { CarID: result.insertId, ...payload, Availability: 'available' };
}

async function updateCar(id, payload) {
  await db.query(
    'UPDATE cars SET Model = ?, Brand = ?, Price = ? WHERE CarID = ?',
    [payload.Model, payload.Brand, payload.Price, id]
  );

  return await getById(id);
}

async function deleteCar(id) {
  await db.query('DELETE FROM cars WHERE CarID = ?', [id]);
}

module.exports = {
  getAll,
  getAvailable,
  getById,
  addCar,
  updateCar,
  deleteCar
};
