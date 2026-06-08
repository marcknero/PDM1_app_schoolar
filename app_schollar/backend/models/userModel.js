const pool = require('../database/connection');

async function findUserByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, nome, email, password_hash, perfil FROM users WHERE email = $1 LIMIT 1',
    [String(email || '').trim().toLowerCase()]
  );

  return rows[0] || null;
}

module.exports = {
  findUserByEmail,
};