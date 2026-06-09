import Constants from 'expo-constants';

const defaultApiBaseUrl = 'https://app-schollar-api.onrender.com/api';

function normalizeApiBaseUrl(value: string | null | undefined) {
  if (!value) {
    return defaultApiBaseUrl;
  }

  const trimmed = value.trim().replace(/\/+$/, '');

  if (trimmed.endsWith('/api')) {
    return trimmed;
  }

  return `${trimmed}/api`;
}

const apiBaseUrl = normalizeApiBaseUrl(
  process.env.EXPO_PUBLIC_API_BASE_URL ?? Constants.expoConfig?.extra?.apiBaseUrl
);

export type DashboardSummary = {
  greetings: string;
  stats: { label: string; value: string }[];
  schedule: { time: string; title: string; meta: string }[];
  announcements: { title: string; text: string }[];
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

export type LoginResponse = {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    perfil: string;
  };
};

export type CurrentProfileResponse = {
  usuario: {
    id: number;
    nome: string;
    email: string;
    perfil: 'coordenacao' | 'professor' | 'aluno';
  };
  aluno?: {
    id: number;
    nome: string;
    matricula: string;
    curso: string;
    email: string | null;
  } | null;
  professor?: {
    id: number;
    nome: string;
    titulacao: string;
    area: string;
    email: string;
  } | null;
};

export type StudentRecord = {
  id: number;
  nome: string;
  matricula: string;
  curso: string;
  email: string | null;
  telefone: string | null;
  cep: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  user_id?: number | null;
};

export type TeacherRecord = {
  id: number;
  nome: string;
  titulacao: string;
  area: string;
  tempo_docencia: number;
  email: string;
  user_id?: number | null;
};

export type SubjectRecord = {
  id: number;
  nome: string;
  carga_horaria: number;
  professor_id: number | null;
  curso: string;
  semestre: number;
};

export type GradeRecord = {
  id: number;
  aluno_id: number;
  aluno_nome: string;
  matricula: string;
  disciplina_id: number;
  disciplina: string;
  nota1: number;
  nota2: number;
  media: number;
  situacao: string;
};

export type AuthenticatedPayload = {
  email: string;
  password: string;
};

let sessionToken: string | null = null;

export function setSessionToken(token: string | null) {
  sessionToken = token;
}

function buildHeaders(extraHeaders: HeadersInit = {}) {
  return {
    'Content-Type': 'application/json',
    ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
    ...extraHeaders,
  };
}

function parseInteger(value: string | number | null | undefined, fallback = 0) {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  const parsed = Number.parseInt(String(value).replace(/\D/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: buildHeaders(options.headers),
  });

  const rawBody = await response.text();
  const body = rawBody ? JSON.parse(rawBody) : null;

  if (!response.ok) {
    throw new Error(body?.message || 'Falha ao comunicar com o servidor.');
  }

  return body as T;
}

export async function signIn(payload: AuthenticatedPayload): Promise<LoginResponse> {
  return request<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchDashboardSummary(name = 'Equipe Escolar'): Promise<DashboardSummary> {
  return request<DashboardSummary>(`/dashboard?nome=${encodeURIComponent(name)}`);
}

export async function fetchCurrentProfile(): Promise<CurrentProfileResponse> {
  return request<CurrentProfileResponse>('/me');
}

export async function fetchStudents(): Promise<StudentRecord[]> {
  const response = await request<{ alunos: StudentRecord[] }>('/alunos');
  return response.alunos || [];
}

export async function fetchStudentById(id: number | string): Promise<StudentRecord> {
  const response = await request<{ aluno: StudentRecord }>(`/alunos/${encodeURIComponent(String(id))}`);
  return response.aluno;
}

export async function saveStudent(id: number | null, payload: Record<string, string>) {
  const body = buildAcademicPayload('Aluno', payload);

  if (id) {
    return request<{ message: string; aluno: StudentRecord }>(`/alunos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  return request<{ message: string; aluno: StudentRecord }>('/alunos', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function removeStudent(id: number | string) {
  return request<{ message: string }>(`/alunos/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
  });
}

export async function fetchTeachers(): Promise<TeacherRecord[]> {
  const response = await request<{ professores: TeacherRecord[] }>('/professores');
  return response.professores || [];
}

export async function fetchTeacherById(id: number | string): Promise<TeacherRecord> {
  const response = await request<{ professor: TeacherRecord }>(`/professores/${encodeURIComponent(String(id))}`);
  return response.professor;
}

export async function saveTeacher(id: number | null, payload: Record<string, string>) {
  const body = buildAcademicPayload('Professor', payload);

  if (id) {
    return request<{ message: string; professor: TeacherRecord }>(`/professores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  return request<{ message: string; professor: TeacherRecord }>('/professores', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function removeTeacher(id: number | string) {
  return request<{ message: string }>(`/professores/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
  });
}

export async function fetchSubjects(): Promise<SubjectRecord[]> {
  const response = await request<{ disciplinas: SubjectRecord[] }>('/disciplinas');
  return response.disciplinas || [];
}

export async function fetchSubjectById(id: number | string): Promise<SubjectRecord> {
  const response = await request<{ disciplina: SubjectRecord }>(`/disciplinas/${encodeURIComponent(String(id))}`);
  return response.disciplina;
}

export async function saveSubject(id: number | null, payload: Record<string, string>) {
  const body = buildAcademicPayload('Disciplina', payload);

  if (id) {
    return request<{ message: string; disciplina: SubjectRecord }>(`/disciplinas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  return request<{ message: string; disciplina: SubjectRecord }>('/disciplinas', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function removeSubject(id: number | string) {
  return request<{ message: string }>(`/disciplinas/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
  });
}

export async function fetchGradesByProfessor(professorId: number | string) {
  const response = await request<{ notas: GradeRecord[] }>(`/notas/professor/${encodeURIComponent(String(professorId))}`);
  return response.notas || [];
}

export async function fetchBulletinByAlunoId(alunoId: number | string) {
  const response = await request<{ disciplinas: { nota_id: number; disciplina: string; nota1: number; nota2: number; media: number; situacao: string }[] }>(
    `/boletim/aluno/${encodeURIComponent(String(alunoId))}`
  );

  return response.disciplinas || [];
}

export async function fetchBulletin(matricula = '2024001'): Promise<BulletinData> {
  const response = await request<{
    aluno: string;
    matricula: string;
    curso: string;
    disciplinas: { disciplina: string; nota1: number; nota2: number; media: number; situacao: string }[];
  }>(`/boletim/${encodeURIComponent(matricula)}`);

  const medias = response.disciplinas.map((item) => item.media);
  const average = medias.length ? medias.reduce((sum, current) => sum + current, 0) / medias.length : 0;

  return {
    studentName: response.aluno,
    className: response.curso,
    average,
    attendance: '100%',
    status: response.disciplinas.some((item) => item.situacao === 'Reprovado') ? 'Em recuperação' : 'Aprovado',
    subjects: response.disciplinas.map((item) => ({
      subject: item.disciplina,
      grade: item.media,
      attendance: '100%',
    })),
  };
}

function buildAcademicPayload(entity: string, payload: Record<string, string>) {
  if (entity === 'Aluno') {
    return {
      nome: payload.nome,
      matricula: payload.matricula,
      curso: payload.curso || payload.turma || 'Não informado',
      email: payload.email || null,
      telefone: payload.telefone || null,
      cep: payload.cep || null,
      endereco: payload.endereco || null,
      cidade: payload.cidade || null,
      estado: payload.estado || null,
    };
  }

  if (entity === 'Professor') {
    return {
      nome: payload.nome,
      titulacao: payload.titulacao || payload.especialidade || 'Não informado',
      area: payload.area || payload.especialidade || 'Não informado',
      tempo_docencia: parseInteger(payload.tempo_docencia, 0),
      email: payload.email,
    };
  }

  return {
    nome: payload.nome,
    carga_horaria: parseInteger(payload.carga_horaria || payload.cargaHoraria, 0),
    professor_id: payload.professor_id ? Number(payload.professor_id) : null,
    curso: payload.curso || payload.turma || 'Não informado',
    semestre: parseInteger(payload.semestre, 1),
  };
}

export async function persistRegistration(entity: string, payload: Record<string, string>) {
  const route = entity === 'Aluno' ? '/alunos' : entity === 'Professor' ? '/professores' : '/disciplinas';

  return request<{ message: string; aluno?: unknown; professor?: unknown; disciplina?: unknown }>(route, {
    method: 'POST',
    body: JSON.stringify(buildAcademicPayload(entity, payload)),
  });
}

export async function updateRegistration(entity: string, id: number | string, payload: Record<string, string>) {
  const route = entity === 'Aluno' ? '/alunos' : entity === 'Professor' ? '/professores' : '/disciplinas';

  return request<{ message: string; aluno?: unknown; professor?: unknown; disciplina?: unknown }>(`${route}/${encodeURIComponent(String(id))}`, {
    method: 'PUT',
    body: JSON.stringify(buildAcademicPayload(entity, payload)),
  });
}

export async function deleteRegistration(entity: string, id: number | string) {
  const route = entity === 'Aluno' ? '/alunos' : entity === 'Professor' ? '/professores' : '/disciplinas';

  return request<{ message: string }>(`${route}/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
  });
}

export async function lookupCep(cep: string) {
  return request<{ cep: string; endereco: string; cidade: string; estado: string }>(`/viacep/${encodeURIComponent(cep)}`);
}

export async function fetchStates() {
  return request<{ estados: { id: number; nome: string; sigla: string }[] }>('/ibge/estados');
}

export async function fetchCities(uf: string) {
  return request<{ cidades: { id: number; nome: string }[] }>(`/ibge/estados/${encodeURIComponent(uf)}/cidades`);
}