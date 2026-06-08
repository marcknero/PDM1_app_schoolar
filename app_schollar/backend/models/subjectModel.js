const pool = require('../database/connection');

async function createSubject(data) {
  const { nome, carga_horaria, professor_id = null, curso, semestre } = data;

  const { rows } = await pool.query(
    `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nome, carga_horaria, professor_id, curso, semestre`,
    [nome, carga_horaria, professor_id, curso, semestre]
  );

  return rows[0];
}

async function countSubjects() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM disciplinas');
  return rows[0].total;
}

module.exports = {
  createSubject,
  countSubjects,
};