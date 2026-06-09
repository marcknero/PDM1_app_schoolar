const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser, linkUserToStudent, linkUserToTeacher } = require('../models/userModel');
const { findStudentByMatricula } = require('../models/studentModel');
const { findTeacherById } = require('../models/teacherModel');

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

async function register(req, res) {
  const { nome, email, password, perfil, matricula, professor_id } = req.body || {};

  if (!nome || !email || !password || !perfil) {
    return res.status(400).json({ message: 'Nome, e-mail, senha e perfil são obrigatórios.' });
  }

  if (!['coordenacao', 'professor', 'aluno'].includes(perfil)) {
    return res.status(400).json({ message: 'Perfil inválido. Use: coordenacao, professor ou aluno.' });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'E-mail já cadastrado.' });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = await createUser({ nome, email, password_hash, perfil });

  if (perfil === 'aluno' && matricula) {
    const student = await findStudentByMatricula(matricula);
    if (student) {
      await linkUserToStudent(user.id, student.id);
    }
  }

  if (perfil === 'professor' && professor_id) {
    const teacher = await findTeacherById(professor_id);
    if (teacher) {
      await linkUserToTeacher(user.id, teacher.id);
    }
  }

  return res.status(201).json({
    message: 'Usuário cadastrado com sucesso.',
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
  register,
};