const pool = require('../database/connection');

async function createStudent(data) {
  const {
    nome,
    matricula,
    curso,
    email = null,
    telefone = null,
    cep = null,
    endereco = null,
    cidade = null,
    estado = null,
    user_id = null,
  } = data;

  const { rows } = await pool.query(
    `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id, nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, user_id`,
    [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, user_id]
  );

  return rows[0];
}

async function findStudentByMatricula(matricula) {
  const { rows } = await pool.query('SELECT * FROM alunos WHERE matricula = $1 LIMIT 1', [matricula]);
  return rows[0] || null;
}

async function findStudentById(id) {
  const { rows } = await pool.query('SELECT * FROM alunos WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
}

async function findStudentByUserId(user_id) {
  const { rows } = await pool.query('SELECT * FROM alunos WHERE user_id = $1 LIMIT 1', [user_id]);
  return rows[0] || null;
}

async function getAllStudents() {
  const { rows } = await pool.query('SELECT * FROM alunos ORDER BY nome');
  return rows;
}

async function countStudents() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM alunos');
  return rows[0].total;
}

async function updateStudent(id, data) {
  const {
    nome,
    matricula,
    curso,
    email = null,
    telefone = null,
    cep = null,
    endereco = null,
    cidade = null,
    estado = null,
  } = data;

  const { rows } = await pool.query(
    `UPDATE alunos
     SET nome = $1, matricula = $2, curso = $3, email = $4, telefone = $5,
         cep = $6, endereco = $7, cidade = $8, estado = $9
     WHERE id = $10
     RETURNING id, nome, matricula, curso, email, telefone, cep, endereco, cidade, estado`,
    [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, id]
  );

  return rows[0];
}

async function deleteStudent(id) {
  const { rows } = await pool.query('DELETE FROM alunos WHERE id = $1 RETURNING id', [id]);
  return rows[0];
}

module.exports = {
  createStudent,
  findStudentByMatricula,
  findStudentById,
  findStudentByUserId,
  getAllStudents,
  countStudents,
  updateStudent,
  deleteStudent,
};