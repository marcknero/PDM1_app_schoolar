const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('../database/connection');

async function applySchema() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(schema);
  console.log('✅ Schema aplicado ou verificado com sucesso.');
}

async function seedIfNeeded() {
  console.log('Verificando necessidade de seed... RUN_SEED =', process.env.RUN_SEED);
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM users');
  const hasUsers = rows[0].count > 0;

  if (hasUsers && process.env.RUN_SEED !== 'true') {
    console.log('ℹ️ Banco já possui dados e RUN_SEED não é "true". Pulando limpeza.');
    return;
  }

  if (hasUsers && process.env.RUN_SEED === 'true') {
    console.log('⚠️ RUN_SEED=true detectado: Limpando tabelas (TRUNCATE)...');
    await pool.query('TRUNCATE TABLE notas, disciplinas, alunos, professores, users RESTART IDENTITY CASCADE');
  }

  console.log('🌱 Iniciando inserção de dados iniciais...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const passwordHash = await bcrypt.hash('123456', 10);

    // 1. Criar usuário da Coordenação primeiro
    // 1. Criar usuário da Coordenação
    await client.query(
      `INSERT INTO users (nome, email, password_hash, perfil)
       VALUES ($1, $2, $3, $4)`,
      ['Equipe Escolar', 'coordenacao@escola.com', passwordHash, 'coordenacao']
    );

    // 2. Criar Professor (Usuário + Perfil)
    const teacherUserResult = await client.query(
      `INSERT INTO users (nome, email, password_hash, perfil)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['Carla Mendes', 'carla.mendes@escola.com', passwordHash, 'professor']
    );

    const teacherResult = await client.query(
      `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      ['Carla Mendes', 'Mestra', 'Programação Mobile', 8, 'carla.mendes@escola.com', teacherUserResult.rows[0].id]
    );

    const studentUserResult = await client.query(
      `INSERT INTO users (nome, email, password_hash, perfil)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['Maria Souza', 'maria.souza@escola.com', passwordHash, 'aluno']
    );

    const studentResult = await client.query(
      `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        'Maria Souza',
        '2024001',
        'Técnico em Informática',
        'maria.souza@escola.com',
        '(11) 98888-1111',
        '12245000',
        'Rua Exemplo, 123',
        'São José dos Campos',
        'SP',
        studentUserResult.rows[0].id,
      ]
    );

    const subjectResult = await client.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['Programação Mobile', 80, teacherResult.rows[0].id, 'Técnico em Informática', 4]
    );
    
    const subject2Result = await client.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['Banco de Dados', 60, teacherResult.rows[0].id, 'Técnico em Informática', 4]
    );

    // Inserir notas em DUAS matérias para testar o boletim múltiplo
    await client.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [studentResult.rows[0].id, subjectResult.rows[0].id, 8, 7, 7.5, 'Aprovado']
    );

    await client.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [studentResult.rows[0].id, subject2Result.rows[0].id, 6, 8, 7.0, 'Aprovado']
    );

    await client.query('COMMIT');
    console.log('✅ Seed concluído com sucesso! Carla Mendes adicionada a users e professores.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function setup() {
  try {
    await applySchema();
    await seedIfNeeded();
  } catch (error) {
    console.error('Falha ao preparar o banco:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

setup();
