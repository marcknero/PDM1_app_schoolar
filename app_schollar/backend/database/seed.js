const bcrypt = require('bcryptjs');
const pool = require('./connection');

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE TABLE notas, disciplinas, alunos, professores, users RESTART IDENTITY CASCADE');

    const passwordHash = await bcrypt.hash('123456', 10);

    const userResult = await client.query(
      `INSERT INTO users (nome, email, password_hash, perfil)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['Equipe Escolar', 'coordenacao@escola.com', passwordHash, 'coordenacao']
    );

    const teacherResult = await client.query(
      `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['Carla Mendes', 'Mestra', 'Programação Mobile', 8, 'carla.mendes@escola.com']
    );

    const studentResult = await client.query(
      `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
      ]
    );

    const subjectResult = await client.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['Programação Mobile', 80, teacherResult.rows[0].id, 'Técnico em Informática', 4]
    );

    await client.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [studentResult.rows[0].id, subjectResult.rows[0].id, 8, 7, 7.5, 'Aprovado']
    );

    await client.query('COMMIT');
    console.log('Seed concluído com sucesso. Usuário padrão: coordenacao@escola.com / 123456');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Falha ao executar seed:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();