const db = require('./db');

async function findByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE Email = ? LIMIT 1', [email]);
  return rows[0];
}

async function createUser({ name, email, password, role = 'buyer' }) {
  const [result] = await db.query(
    'INSERT INTO users (Name, Email, Role) VALUES (?, ?, ?)',
    [name, email, role]
  );
  return { UserID: result.insertId, Name: name, Email: email, Role: role };
}

async function verifyUser(email, password) {
  const user = await findByEmail(email);
  if (!user) return null;
  return { UserID: user.UserID, Name: user.Name, Email: user.Email, Role: user.Role };
}

module.exports = {
  findByEmail,
  createUser,
  verifyUser
};
