const pool = require('../database/connection');

async function createTeacher(data) {
  const { nome, titulacao, area, tempo_docencia = 0, email, user_id = null } = data;

  const { rows } = await pool.query(
    `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email, user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, nome, titulacao, area, tempo_docencia, email, user_id`,
    [nome, titulacao, area, tempo_docencia, email, user_id]
  );

  return rows[0];
}

async function findTeacherById(id) {
  const { rows } = await pool.query('SELECT * FROM professores WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
}

async function findTeacherByUserId(user_id) {
  const { rows } = await pool.query('SELECT * FROM professores WHERE user_id = $1 LIMIT 1', [user_id]);
  return rows[0] || null;
}

async function getAllTeachers() {
  const { rows } = await pool.query('SELECT * FROM professores ORDER BY nome');
  return rows;
}

async function countTeachers() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM professores');
  return rows[0].total;
}

async function updateTeacher(id, data) {
  const { nome, titulacao, area, tempo_docencia, email } = data;

  const { rows } = await pool.query(
    `UPDATE professores
     SET nome = $1, titulacao = $2, area = $3, tempo_docencia = $4, email = $5
     WHERE id = $6
     RETURNING id, nome, titulacao, area, tempo_docencia, email`,
    [nome, titulacao, area, tempo_docencia, email, id]
  );

  return rows[0];
}

async function deleteTeacher(id) {
  const { rows } = await pool.query('DELETE FROM professores WHERE id = $1 RETURNING id', [id]);
  return rows[0];
}

module.exports = {
  createTeacher,
  findTeacherById,
  findTeacherByUserId,
  getAllTeachers,
  countTeachers,
  updateTeacher,
  deleteTeacher,
};