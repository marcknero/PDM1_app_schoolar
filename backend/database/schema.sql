CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  perfil VARCHAR(40) NOT NULL DEFAULT 'coordenacao',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD CONSTRAINT check_perfil CHECK (perfil IN ('coordenacao', 'professor', 'aluno'));

CREATE TABLE IF NOT EXISTS professores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  titulacao VARCHAR(120) NOT NULL,
  area VARCHAR(120) NOT NULL,
  tempo_docencia INTEGER NOT NULL DEFAULT 0,
  email VARCHAR(160) NOT NULL UNIQUE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alunos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  matricula VARCHAR(40) NOT NULL UNIQUE,
  curso VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE,
  telefone VARCHAR(30),
  cep VARCHAR(12),
  endereco VARCHAR(180),
  cidade VARCHAR(120),
  estado VARCHAR(80),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disciplinas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  carga_horaria INTEGER NOT NULL,
  professor_id INTEGER REFERENCES professores(id) ON DELETE SET NULL,
  curso VARCHAR(120) NOT NULL,
  semestre INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notas (
  id SERIAL PRIMARY KEY,
  aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  nota1 NUMERIC(4,2) NOT NULL DEFAULT 0,
  nota2 NUMERIC(4,2) NOT NULL DEFAULT 0,
  media NUMERIC(4,2) NOT NULL DEFAULT 0,
  situacao VARCHAR(40) NOT NULL DEFAULT 'Em análise',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (aluno_id, disciplina_id)
);

CREATE INDEX IF NOT EXISTS idx_alunos_matricula ON alunos (matricula);
CREATE INDEX IF NOT EXISTS idx_notas_aluno ON notas (aluno_id);
CREATE INDEX IF NOT EXISTS idx_notas_disciplina ON notas (disciplina_id);