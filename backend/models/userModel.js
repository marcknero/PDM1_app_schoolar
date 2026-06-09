const pool = require('../database/connection');

async function findUserByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, nome, email, password_hash, perfil FROM users WHERE email = $1 LIMIT 1',
    [String(email || '').trim().toLowerCase()]
  );

  return rows[0] || null;
}

async function createUser(data) {
  const { nome, email, password_hash, perfil } = data;

  const { rows } = await pool.query(
    `INSERT INTO users (nome, email, password_hash, perfil)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, email, perfil`,
    [nome, email, password_hash, perfil]
  );

  return rows[0];
}

async function linkUserToStudent(user_id, aluno_id) {
  const { rows } = await pool.query(
    'UPDATE alunos SET user_id = $1 WHERE id = $2 RETURNING id',
    [user_id, aluno_id]
  );
  return rows[0];
}

async function linkUserToTeacher(user_id, professor_id) {
  const { rows } = await pool.query(
    'UPDATE professores SET user_id = $1 WHERE id = $2 RETURNING id',
    [user_id, professor_id]
  );
  return rows[0];
}

module.exports = {
  findUserByEmail,
  createUser,
  linkUserToStudent,
  linkUserToTeacher,
};