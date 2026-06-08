const { fetchEstados, fetchCidades, lookupCep } = require('../services/externalApis');

async function estados(req, res) {
  const data = await fetchEstados();
  return res.json({ estados: data });
}

async function cidades(req, res) {
  const { uf } = req.params;
  const data = await fetchCidades(uf);
  return res.json({ cidades: data });
}

async function cep(req, res) {
  const { cep } = req.params;
  const data = await lookupCep(cep);

  if (!data) {
    return res.status(404).json({ message: 'CEP não encontrado.' });
  }

  return res.json(data);
}

module.exports = {
  estados,
  cidades,
  cep,
};