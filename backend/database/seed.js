const bcrypt = require('bcryptjs');
const pool = require('./connection');

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE TABLE notas, disciplinas, alunos, professores, users RESTART IDENTITY CASCADE');

    const passwordHash = await bcrypt.hash('123456', 10);

    const coordUserResult = await client.query(
      `INSERT INTO users (nome, email, password_hash, perfil)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['Equipe Escolar', 'coordenacao@escola.com', passwordHash, 'coordenacao']
    );

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

    const student2UserResult = await client.query(
      `INSERT INTO users (nome, email, password_hash, perfil)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['João Silva', 'joao.silva@escola.com', passwordHash, 'aluno']
    );

    const student2Result = await client.query(
      `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        'João Silva',
        '2024002',
        'Técnico em Informática',
        'joao.silva@escola.com',
        '(11) 98888-2222',
        '12245000',
        'Rua Exemplo, 456',
        'São José dos Campos',
        'SP',
        student2UserResult.rows[0].id,
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

    await client.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [student2Result.rows[0].id, subjectResult.rows[0].id, 5, 6, 5.5, 'Reprovado']
    );

    await client.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [student2Result.rows[0].id, subject2Result.rows[0].id, 7, 8, 7.5, 'Aprovado']
    );

    await client.query('COMMIT');
    console.log('Seed concluído com sucesso.');
    console.log('Usuários de teste:');
    console.log('- Equipe Escolar: coordenacao@escola.com / 123456');
    console.log('- Professor: carla.mendes@escola.com / 123456');
    console.log('- Aluno 1: maria.souza@escola.com / 123456');
    console.log('- Aluno 2: joao.silva@escola.com / 123456');
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