const { lookupCep } = require('../services/externalApis');
const { createStudent } = require('../models/studentModel');

async function create(req, res) {
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
}

module.exports = {
  create,
};