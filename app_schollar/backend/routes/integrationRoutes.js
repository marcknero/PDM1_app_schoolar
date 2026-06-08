const express = require('express');
const { cidades, cep, estados } = require('../controllers/integrationController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);
router.get('/ibge/estados', estados);
router.get('/ibge/estados/:uf/cidades', cidades);
router.get('/viacep/:cep', cep);

module.exports = router;