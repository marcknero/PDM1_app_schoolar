const { countStudents } = require('../models/studentModel');
const { countTeachers } = require('../models/teacherModel');
const { countSubjects } = require('../models/subjectModel');
const { countBulletins } = require('../models/gradeModel');

async function summary(req, res) {
  const nome = req.user?.nome || req.query.nome || 'Equipe Escolar';
  const [students, teachers, subjects, bulletins] = await Promise.all([
    countStudents(),
    countTeachers(),
    countSubjects(),
    countBulletins(),
  ]);

  return res.json({
    greetings: `Painel rápido para organizar o dia de ${nome}.`,
    stats: [
      { label: 'Alunos ativos', value: String(students) },
      { label: 'Professores', value: String(teachers) },
      { label: 'Disciplinas', value: String(subjects) },
      { label: 'Boletins', value: String(bulletins) },
    ],
    schedule: [
      { time: '07:30', title: 'Conferência de turma', meta: 'Recepção | Bloco A' },
      { time: '10:00', title: 'Reunião de coordenação', meta: 'Sala da direção' },
      { time: '14:00', title: 'Atualização de notas', meta: 'Sistema acadêmico' },
    ],
    announcements: [
      { title: 'Base conectada', text: 'O painel agora consulta o backend em vez de dados estáticos.' },
      { title: 'Integrações ativas', text: 'ViaCEP e IBGE já estão disponíveis via API do sistema.' },
    ],
  });
}

module.exports = {
  summary,
};