const { createTeacher } = require('../models/teacherModel');

async function create(req, res) {
  const body = req.body || {};

  if (!body.nome || !body.titulacao || !body.area || !body.email) {
    return res.status(400).json({ message: 'Nome, titulação, área e e-mail são obrigatórios.' });
  }

  const created = await createTeacher(body);

  return res.status(201).json({
    message: 'Professor cadastrado com sucesso.',
    professor: created,
  });
}

module.exports = {
  create,
};