const pool = require('../database/connection');

async function createTeacher(data) {
  const { nome, titulacao, area, tempo_docencia = 0, email } = data;

  const { rows } = await pool.query(
    `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nome, titulacao, area, tempo_docencia, email`,
    [nome, titulacao, area, tempo_docencia, email]
  );

  return rows[0];
}

async function countTeachers() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM professores');
  return rows[0].total;
}

module.exports = {
  createTeacher,
  countTeachers,
};