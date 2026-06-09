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

async function findSubjectById(id) {
  const { rows } = await pool.query('SELECT * FROM disciplinas WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
}

async function getAllSubjects() {
  const { rows } = await pool.query('SELECT * FROM disciplinas ORDER BY nome');
  return rows;
}

async function getSubjectsByProfessor(professor_id) {
  const { rows } = await pool.query(
    'SELECT * FROM disciplinas WHERE professor_id = $1 ORDER BY nome',
    [professor_id]
  );
  return rows;
}

async function countSubjects() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM disciplinas');
  return rows[0].total;
}

async function updateSubject(id, data) {
  const { nome, carga_horaria, professor_id, curso, semestre } = data;

  const { rows } = await pool.query(
    `UPDATE disciplinas
     SET nome = $1, carga_horaria = $2, professor_id = $3, curso = $4, semestre = $5
     WHERE id = $6
     RETURNING id, nome, carga_horaria, professor_id, curso, semestre`,
    [nome, carga_horaria, professor_id, curso, semestre, id]
  );

  return rows[0];
}

async function deleteSubject(id) {
  const { rows } = await pool.query('DELETE FROM disciplinas WHERE id = $1 RETURNING id', [id]);
  return rows[0];
}

module.exports = {
  createSubject,
  findSubjectById,
  getAllSubjects,
  getSubjectsByProfessor,
  countSubjects,
  updateSubject,
  deleteSubject,
};