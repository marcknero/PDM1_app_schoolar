const { calculateGradeSituation, roundToOneDecimal } = require('../services/mathService');
const { fetchBulletinByMatricula, upsertGrade } = require('../models/gradeModel');
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

module.exports = {
  saveGrade,
  bulletin,
};