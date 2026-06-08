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
  } = data;

  const { rows } = await pool.query(
    `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, nome, matricula, curso, email, telefone, cep, endereco, cidade, estado`,
    [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado]
  );

  return rows[0];
}

async function findStudentByMatricula(matricula) {
  const { rows } = await pool.query('SELECT * FROM alunos WHERE matricula = $1 LIMIT 1', [matricula]);
  return rows[0] || null;
}

async function countStudents() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM alunos');
  return rows[0].total;
}

module.exports = {
  createStudent,
  findStudentByMatricula,
  countStudents,
};