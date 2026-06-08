const axios = require('axios');

function createHttpClient(baseURL) {
  return axios.create({
    baseURL,
    timeout: 8000,
  });
}

async function lookupCep(cep) {
  const client = createHttpClient(process.env.VIACEP_BASE_URL || 'https://viacep.com.br/ws');
  const normalizedCep = String(cep || '').replace(/\D/g, '');

  if (!normalizedCep) {
    return null;
  }

  const response = await client.get(`/${normalizedCep}/json/`);
  if (response.data?.erro) {
    return null;
  }

  return {
    cep: normalizedCep,
    endereco: [response.data.logradouro, response.data.bairro].filter(Boolean).join(' - '),
    cidade: response.data.localidade || '',
    estado: response.data.uf || '',
  };
}

async function fetchEstados() {
  const client = createHttpClient(process.env.IBGE_BASE_URL || 'https://servicodados.ibge.gov.br/api/v1/localidades');
  const response = await client.get('/estados');

  return response.data
    .map((item) => ({ id: item.id, nome: item.nome, sigla: item.sigla }))
    .sort((left, right) => left.nome.localeCompare(right.nome));
}

async function fetchCidades(uf) {
  const client = createHttpClient(process.env.IBGE_BASE_URL || 'https://servicodados.ibge.gov.br/api/v1/localidades');
  const response = await client.get(`/estados/${String(uf).toUpperCase()}/municipios`);

  return response.data.map((item) => ({ id: item.id, nome: item.nome }));
}

module.exports = {
  lookupCep,
  fetchEstados,
  fetchCidades,
};