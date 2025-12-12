const db = require('./db');

const categories = ['New', 'Used', 'Electric', 'Hybrid'];

function normalize(text) {
  return (text || '').toString().toLowerCase();
}

async function getAll() {
  const [rows] = await db.query('SELECT * FROM cars ORDER BY id ASC');
  return rows;
}

function getCategories() {
  return categories;
}

async function getAvailable(category, searchTerm) {
  const categoryFilter = normalize(category);
  const searchFilter = normalize(searchTerm);

  let sql = 'SELECT * FROM cars WHERE status = ?';
  const params = ['available'];

  if (categoryFilter) {
    sql += ' AND LOWER(category) = ?';
    params.push(categoryFilter);
  }

  if (searchFilter) {
    sql += ' AND (LOWER(name) LIKE ? OR LOWER(type) LIKE ?)';
    params.push(`%${searchFilter}%`, `%${searchFilter}%`);
  }

  sql += ' ORDER BY id ASC';

  const [rows] = await db.query(sql, params);
  return rows;
}

async function getHighlights() {
  const [rows] = await db.query('SELECT * FROM cars WHERE highlight = 1 AND status = ? ORDER BY id ASC', ['available']);
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM cars WHERE id = ? LIMIT 1', [id]);
  return rows[0];
}

async function addCar(payload) {
  const [result] = await db.query(
    'INSERT INTO cars (name, category, `condition`, pricePerDay, type, status, highlight) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      payload.name || 'Untitled',
      payload.category || 'New',
      payload.condition || 'New',
      payload.pricePerDay || 0,
      payload.type || 'Sedan',
      'available',
      payload.highlight ? 1 : 0
    ]
  );

  return { id: result.insertId, ...payload, status: 'available' };
}

async function toggleAvailability(id) {
  const car = await getById(id);
  if (!car) return null;

  const newStatus = car.status === 'available' ? 'maintenance' : 'available';
  await db.query('UPDATE cars SET status = ?, rentedBy = NULL WHERE id = ?', [newStatus, id]);

  return { ...car, status: newStatus, rentedBy: null };
}

async function rentCar(id, renterName) {
  const car = await getById(id);
  if (!car || car.status !== 'available') return null;

  await db.query('UPDATE cars SET status = ?, rentedBy = ? WHERE id = ?', ['rented', renterName, id]);
  return { ...car, status: 'rented', rentedBy: renterName };
}

async function deleteCar(id) {
  await db.query('DELETE FROM cars WHERE id = ?', [id]);
}

module.exports = {
  getAll,
  getAvailable,
  getCategories,
  getHighlights,
  addCar,
  toggleAvailability,
  rentCar,
  deleteCar
};
