const {
  createSubject,
  findSubjectById,
  getAllSubjects,
  getSubjectsByProfessor,
  updateSubject,
  deleteSubject,
} = require('../models/subjectModel');

async function create(req, res) {
  try {
    const body = req.body || {};

    if (!body.nome || !body.carga_horaria || !body.curso || !body.semestre) {
      return res.status(400).json({ message: 'Nome, carga horária, curso e semestre são obrigatórios.' });
    }

    const created = await createSubject(body);

    return res.status(201).json({
      message: 'Disciplina cadastrada com sucesso.',
      disciplina: created,
    });
  } catch (error) {
    console.error('Erro ao criar disciplina:', error);
    return res.status(500).json({ message: 'Erro interno ao cadastrar disciplina.' });
  }
}

async function getAll(req, res) {
  const subjects = await getAllSubjects();
  return res.json({ disciplinas: subjects });
}

async function getById(req, res) {
  const { id } = req.params;
  const subject = await findSubjectById(id);

  if (!subject) {
    return res.status(404).json({ message: 'Disciplina não encontrada.' });
  }

  return res.json({ disciplina: subject });
}

async function getByProfessor(req, res) {
  const { professor_id } = req.params;
  const subjects = await getSubjectsByProfessor(professor_id);
  return res.json({ disciplinas: subjects });
}

async function update(req, res) {
  const { id } = req.params;
  const body = req.body || {};

  if (!body.nome || !body.carga_horaria || !body.curso || !body.semestre) {
    return res.status(400).json({ message: 'Nome, carga horária, curso e semestre são obrigatórios.' });
  }

  const updated = await updateSubject(id, body);

  if (!updated) {
    return res.status(404).json({ message: 'Disciplina não encontrada.' });
  }

  return res.json({
    message: 'Disciplina atualizada com sucesso.',
    disciplina: updated,
  });
}

async function remove(req, res) {
  const { id } = req.params;
  const deleted = await deleteSubject(id);

  if (!deleted) {
    return res.status(404).json({ message: 'Disciplina não encontrada.' });
  }

  return res.json({ message: 'Disciplina excluída com sucesso.' });
}

module.exports = {
  create,
  getAll,
  getById,
  getByProfessor,
  update,
  remove,
};