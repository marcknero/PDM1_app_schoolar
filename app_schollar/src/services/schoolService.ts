import Constants from 'expo-constants';

const defaultApiBaseUrl = 'http://localhost:3000/api';

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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
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
      curso: payload.turma || 'Não informado',
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
      titulacao: payload.especialidade || 'Não informado',
      area: payload.especialidade || 'Não informado',
      tempo_docencia: parseInteger(payload.tempo_docencia, 0),
      email: payload.email,
    };
  }

  return {
    nome: payload.nome,
    carga_horaria: parseInteger(payload.cargaHoraria || payload.carga_horaria, 0),
    professor_id: payload.professor_id ? Number(payload.professor_id) : null,
    curso: payload.turma || 'Não informado',
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

export async function lookupCep(cep: string) {
  return request<{ cep: string; endereco: string; cidade: string; estado: string }>(`/viacep/${encodeURIComponent(cep)}`);
}

export async function fetchStates() {
  return request<{ estados: { id: number; nome: string; sigla: string }[] }>('/ibge/estados');
}

export async function fetchCities(uf: string) {
  return request<{ cidades: { id: number; nome: string }[] }>(`/ibge/estados/${encodeURIComponent(uf)}/cidades`);
}