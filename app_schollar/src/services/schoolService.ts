const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type DashboardSummary = {
  greetings: string;
  stats: Array<{ label: string; value: string }>;
  schedule: Array<{ time: string; title: string; meta: string }>;
  announcements: Array<{ title: string; text: string }>;
};

export type SubjectGrade = {
  subject: string;
  grade: number;
  attendance: string;
};

export type BulletinData = {
  studentName: string;
  className: string;
  average: number;
  attendance: string;
  status: string;
  subjects: SubjectGrade[];
};

export async function fetchDashboardSummary(name = 'Equipe Escolar'): Promise<DashboardSummary> {
  await delay(320);

  return {
    greetings: `Painel rápido para organizar o dia de ${name}.`,
    stats: [
      { label: 'Alunos ativos', value: '248' },
      { label: 'Professores', value: '18' },
      { label: 'Disciplinas', value: '12' },
      { label: 'Boletins', value: '36' },
    ],
    schedule: [
      { time: '07:30', title: 'Boas-vindas e conferência de turma', meta: 'Recepção | Bloco A' },
      { time: '10:00', title: 'Reunião de coordenação', meta: 'Sala da direção' },
      { time: '14:00', title: 'Atualização de notas parciais', meta: 'Sistema acadêmico' },
    ],
    announcements: [
      { title: 'Nova turma aberta', text: 'A turma 8A já pode receber alunos para o próximo ciclo.' },
      { title: 'Plantão de dúvidas', text: 'Professores terão suporte de cadastro entre 15h e 17h.' },
    ],
  };
}

export async function fetchBulletin(): Promise<BulletinData> {
  await delay(420);

  return {
    studentName: 'Ana Clara dos Santos',
    className: '8A - Ensino Fundamental',
    average: 8.7,
    attendance: '96%',
    status: 'Aprovada',
    subjects: [
      { subject: 'Matemática', grade: 9.2, attendance: '98%' },
      { subject: 'Português', grade: 8.4, attendance: '97%' },
      { subject: 'Ciências', grade: 8.8, attendance: '95%' },
      { subject: 'História', grade: 8.1, attendance: '95%' },
      { subject: 'Artes', grade: 9.0, attendance: '100%' },
    ],
  };
}

export async function persistRegistration(entity: string, payload: Record<string, string>) {
  await delay(500);

  return {
    entity,
    payload,
    savedAt: new Date().toISOString(),
  };
}