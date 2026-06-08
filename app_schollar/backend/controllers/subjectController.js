const { createSubject } = require('../models/subjectModel');

async function create(req, res) {
  const body = req.body || {};

  if (!body.nome || !body.carga_horaria || !body.curso || !body.semestre) {
    return res.status(400).json({ message: 'Nome, carga horária, curso e semestre são obrigatórios.' });
  }

  const created = await createSubject(body);

  return res.status(201).json({
    message: 'Disciplina cadastrada com sucesso.',
    disciplina: created,
  });
}

module.exports = {
  create,
};