const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../models/userModel');

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const passwordMatches = await bcrypt.compare(String(password), user.password_hash);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign(
    { sub: user.id, nome: user.nome, email: user.email, perfil: user.perfil },
    process.env.JWT_SECRET || 'change-me',
    { expiresIn: '8h' }
  );

  return res.json({
    token,
    usuario: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
    },
  });
}

module.exports = {
  login,
};