const {
  createTeacher,
  findTeacherById,
  findTeacherByUserId,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} = require('../models/teacherModel');

async function create(req, res) {
  try {
    const body = req.body || {};

    if (!body.nome || !body.titulacao || !body.area || !body.email || !body.password) {
      return res.status(400).json({ message: 'Nome, titulação, área, e-mail e senha são obrigatórios.' });
    }

    const created = await createTeacher(body);

    return res.status(201).json({
      message: 'Professor cadastrado com sucesso.',
      professor: created,
    });
  } catch (error) {
    console.error('Erro ao criar professor:', error);
    return res.status(500).json({ message: 'Erro interno ao cadastrar professor.' });
  }
}

async function getAll(req, res) {
  const teachers = await getAllTeachers();
  return res.json({ professores: teachers });
}

async function getById(req, res) {
  const { id } = req.params;
  const teacher = await findTeacherById(id);

  if (!teacher) {
    return res.status(404).json({ message: 'Professor não encontrado.' });
  }

  return res.json({ professor: teacher });
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};

    if (!body.nome || !body.titulacao || !body.area || !body.email) {
      return res.status(400).json({ message: 'Nome, titulação, área e e-mail são obrigatórios.' });
    }

    const updated = await updateTeacher(id, body);

    if (!updated) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }

    return res.json({
      message: 'Professor atualizado com sucesso.',
      professor: updated,
    });
  } catch (error) {
    console.error('Erro ao atualizar professor:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar professor.' });
  }
}

async function remove(req, res) {
  const { id } = req.params;
  const deleted = await deleteTeacher(id);

  if (!deleted) {
    return res.status(404).json({ message: 'Professor não encontrado.' });
  }

  return res.json({ message: 'Professor excluído com sucesso.' });
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};