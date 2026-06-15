const { lookupCep } = require('../services/externalApis');
const {
  createStudent,
  findStudentById,
  findStudentByUserId,
  getAllStudents,
  updateStudent,
  deleteStudent,
} = require('../models/studentModel');

async function create(req, res) {
  try {
    const body = req.body || {};

    if (!body.nome || !body.matricula || !body.curso || !body.password) {
      return res.status(400).json({ message: 'Nome, matrícula, curso e senha são obrigatórios.' });
    }

    let enderecoData = {};
    if (body.cep) {
      try {
        const cepData = await lookupCep(body.cep);
        if (cepData) enderecoData = cepData;
      } catch (e) { /* ignore cep error */ }
    }

    const created = await createStudent({
      ...body,
      cep: body.cep || enderecoData.cep || null,
      endereco: body.endereco || enderecoData.endereco || null,
      cidade: body.cidade || enderecoData.cidade || null,
      estado: body.estado || enderecoData.estado || null,
    });

    return res.status(201).json({
      message: 'Aluno cadastrado com sucesso.',
      aluno: created,
    });
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    return res.status(500).json({ message: 'Erro interno ao cadastrar aluno.' });
  }
}


async function getAll(req, res) {
  const students = await getAllStudents();
  return res.json({ alunos: students });
}

async function getById(req, res) {
  const { id } = req.params;
  const student = await findStudentById(id);

  if (!student) {
    return res.status(404).json({ message: 'Aluno não encontrado.' });
  }

  return res.json({ aluno: student });
}

async function update(req, res) {
  const { id } = req.params;
  const body = req.body || {};

  if (!body.nome || !body.matricula || !body.curso) {
    return res.status(400).json({ message: 'Nome, matrícula e curso são obrigatórios.' });
  }

  let enderecoData = {};
  if (body.cep) {
    try {
      const cepData = await lookupCep(body.cep);
      if (cepData) {
        enderecoData = cepData;
      }
    } catch (error) {
      enderecoData = {};
    }
  }

  const updated = await updateStudent(id, {
    ...body,
    cep: body.cep || enderecoData.cep || null,
    endereco: body.endereco || enderecoData.endereco || null,
    cidade: body.cidade || enderecoData.cidade || null,
    estado: body.estado || enderecoData.estado || null,
  });

  if (!updated) {
    return res.status(404).json({ message: 'Aluno não encontrado.' });
  }

  return res.json({
    message: 'Aluno atualizado com sucesso.',
    aluno: updated,
  });
}

async function remove(req, res) {
  const { id } = req.params;
  const deleted = await deleteStudent(id);

  if (!deleted) {
    return res.status(404).json({ message: 'Aluno não encontrado.' });
  }

  return res.json({ message: 'Aluno excluído com sucesso.' });
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};