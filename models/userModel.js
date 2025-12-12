const bcrypt = require('bcryptjs');
const db = require('./db');

async function findByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0];
}

async function createUser({ name, email, password, role = 'user' }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  return { id: result.insertId, name, email, role };
}

async function verifyUser(email, password) {
  const user = await findByEmail(email);
  if (!user) return null;
  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

module.exports = {
  findByEmail,
  createUser,
  verifyUser
};
