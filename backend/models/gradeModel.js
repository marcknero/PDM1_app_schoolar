const pool = require('../database/connection');

async function upsertGrade(data) {
  const { aluno_id, disciplina_id, nota1, nota2, media, situacao } = data;

  const { rows } = await pool.query(
    `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (aluno_id, disciplina_id)
     DO UPDATE SET nota1 = EXCLUDED.nota1, nota2 = EXCLUDED.nota2, media = EXCLUDED.media, situacao = EXCLUDED.situacao
     RETURNING id, aluno_id, disciplina_id, nota1, nota2, media, situacao`,
    [aluno_id, disciplina_id, nota1, nota2, media, situacao]
  );

  return rows[0];
}

async function fetchBulletinByMatricula(matricula) {
  const { rows } = await pool.query(
    `SELECT
       a.nome AS aluno_nome,
       a.matricula,
       a.curso,
       d.nome AS disciplina,
       n.nota1,
       n.nota2,
       n.media,
       n.situacao
     FROM alunos a
     JOIN notas n ON n.aluno_id = a.id
     JOIN disciplinas d ON d.id = n.disciplina_id
     WHERE a.matricula = $1
     ORDER BY d.nome`,
    [matricula]
  );

  return rows;
}

async function fetchBulletinByAlunoId(aluno_id) {
  const { rows } = await pool.query(
    `SELECT
       a.nome AS aluno_nome,
       a.matricula,
       a.curso,
       d.nome AS disciplina,
       n.nota1,
       n.nota2,
       n.media,
       n.situacao,
       n.id AS nota_id
     FROM alunos a
     JOIN notas n ON n.aluno_id = a.id
     JOIN disciplinas d ON d.id = n.disciplina_id
     WHERE a.id = $1
     ORDER BY d.nome`,
    [aluno_id]
  );

  return rows;
}

async function fetchGradesByProfessor(professor_id) {
  const { rows } = await pool.query(
    `SELECT
       n.id,
       a.id AS aluno_id,
       a.nome AS aluno_nome,
       a.matricula,
       d.id AS disciplina_id,
       d.nome AS disciplina,
       n.nota1,
       n.nota2,
       n.media,
       n.situacao
     FROM notas n
     JOIN alunos a ON a.id = n.aluno_id
     JOIN disciplinas d ON d.id = n.disciplina_id
     WHERE d.professor_id = $1
     ORDER BY d.nome, a.nome`,
    [professor_id]
  );

  return rows;
}

async function fetchGradesBySubject(disciplina_id) {
  const { rows } = await pool.query(
    `SELECT
       n.id,
       a.id AS aluno_id,
       a.nome AS aluno_nome,
       a.matricula,
       d.id AS disciplina_id,
       d.nome AS disciplina,
       n.nota1,
       n.nota2,
       n.media,
       n.situacao
     FROM notas n
     JOIN alunos a ON a.id = n.aluno_id
     JOIN disciplinas d ON d.id = n.disciplina_id
     WHERE d.id = $1
     ORDER BY a.nome`,
    [disciplina_id]
  );

  return rows;
}

async function countBulletins() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM notas');
  return rows[0].total;
}

async function deleteGrade(id) {
  const { rows } = await pool.query('DELETE FROM notas WHERE id = $1 RETURNING id', [id]);
  return rows[0];
}

module.exports = {
  upsertGrade,
  fetchBulletinByMatricula,
  fetchBulletinByAlunoId,
  fetchGradesByProfessor,
  fetchGradesBySubject,
  countBulletins,
  deleteGrade,
};