const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token de autenticação ausente.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    if (!allowedRoles.includes(req.user.perfil)) {
      return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};