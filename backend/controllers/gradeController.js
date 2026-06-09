const { calculateGradeSituation, roundToOneDecimal } = require('../services/mathService');
const {
  fetchBulletinByMatricula,
  fetchBulletinByAlunoId,
  fetchGradesByProfessor,
  fetchGradesBySubject,
  upsertGrade,
  deleteGrade,
} = require('../models/gradeModel');
const { findStudentByMatricula } = require('../models/studentModel');

async function saveGrade(req, res) {
  const body = req.body || {};

  if (!body.aluno_id || !body.disciplina_id) {
    return res.status(400).json({ message: 'Aluno e disciplina são obrigatórios.' });
  }

  const nota1 = Number(body.nota1 || 0);
  const nota2 = Number(body.nota2 || 0);
  const media = roundToOneDecimal((nota1 + nota2) / 2);
  const situacao = body.situacao || calculateGradeSituation(media);

  const created = await upsertGrade({
    aluno_id: body.aluno_id,
    disciplina_id: body.disciplina_id,
    nota1,
    nota2,
    media,
    situacao,
  });

  return res.status(201).json({
    message: 'Notas salvas com sucesso.',
    nota: created,
  });
}

async function bulletin(req, res) {
  const { matricula } = req.params;
  const student = await findStudentByMatricula(matricula);

  if (!student) {
    return res.status(404).json({ message: 'Aluno não encontrado.' });
  }

  const rows = await fetchBulletinByMatricula(matricula);

  return res.json({
    aluno: student.nome,
    matricula: student.matricula,
    curso: student.curso,
    disciplinas: rows.map((row) => ({
      disciplina: row.disciplina,
      nota1: Number(row.nota1),
      nota2: Number(row.nota2),
      media: Number(row.media),
      situacao: row.situacao,
    })),
  });
}

async function bulletinByAlunoId(req, res) {
  const { aluno_id } = req.params;
  const rows = await fetchBulletinByAlunoId(aluno_id);

  return res.json({
    disciplinas: rows.map((row) => ({
      nota_id: row.nota_id,
      disciplina: row.disciplina,
      nota1: Number(row.nota1),
      nota2: Number(row.nota2),
      media: Number(row.media),
      situacao: row.situacao,
    })),
  });
}

async function getGradesByProfessor(req, res) {
  const { professor_id } = req.params;
  const grades = await fetchGradesByProfessor(professor_id);
  return res.json({ notas: grades });
}

async function getGradesBySubject(req, res) {
  const { disciplina_id } = req.params;
  const grades = await fetchGradesBySubject(disciplina_id);
  return res.json({ notas: grades });
}

async function remove(req, res) {
  const { id } = req.params;
  const deleted = await deleteGrade(id);

  if (!deleted) {
    return res.status(404).json({ message: 'Nota não encontrada.' });
  }

  return res.json({ message: 'Nota excluída com sucesso.' });
}

module.exports = {
  saveGrade,
  bulletin,
  bulletinByAlunoId,
  getGradesByProfessor,
  getGradesBySubject,
  remove,
};