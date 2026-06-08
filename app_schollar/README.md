# Scholar

Aplicativo escolar reestruturado com React Navigation, telas em `src/` e identidade visual azul-esverdeada.

## Backend em andamento

O projeto agora inicia a integração com um backend Node.js + Express + PostgreSQL dentro da pasta `backend/`.

### Estrutura do backend

- `backend/server.js`: ponto de entrada do servidor
- `backend/routes`: rotas REST
- `backend/controllers`: regras de request/response
- `backend/models`: acesso ao PostgreSQL
- `backend/database`: conexão, schema e seed

### Banco de dados

O schema inclui as tabelas obrigatórias de alunos, professores, disciplinas e notas, além de usuários para autenticação.

### APIs já previstas

- `POST /api/login`
- `GET /api/dashboard`
- `POST /api/alunos`
- `POST /api/professores`
- `POST /api/disciplinas`
- `POST /api/notas`
- `GET /api/boletim/:matricula`
- `GET /api/viacep/:cep`
- `GET /api/ibge/estados`
- `GET /api/ibge/estados/:uf/cidades`

### Como executar o backend

1. Copie `backend/.env.example` para `backend/.env`.
2. Ajuste `DATABASE_URL`, `JWT_SECRET` e as URLs externas se necessário.
3. Crie o banco PostgreSQL e aplique o schema de `backend/database/schema.sql`.
4. Rode o seed com `npm run seed` dentro da pasta `backend/`.
5. Inicie o servidor com `npm start` dentro da pasta `backend/`.

### Login padrão do seed

- E-mail: `coordenacao@escola.com`
- Senha: `123456`

## Estrutura

- `src/components`: componentes reutilizáveis da interface
- `src/contexts`: contexto de autenticação
- `src/navigation`: stack de login e tabs principais
- `src/screens`: telas de login, início, cadastros e boletim
- `src/services`: cliente HTTP e integrações com o backend
- `src/styles`: tema e estilos centralizados

## Telas iniciais

- Login
- Início
- Cadastro de alunos
- Cadastro de professores
- Cadastro de disciplinas
- Visualização de boletim

## Executar

```bash
npm install
npx expo start
```

Para conectar o app ao backend local, defina a URL da API no ambiente do Expo ou ajuste o valor padrão em `src/services/schoolService.ts`.

---
# Status de Implementação
O front ainda tem algumas telas que vão evoluir, mas a base de integração já saiu dos mocks e passou a consumir o backend local em Node.js + PostgreSQL.

Os próximos ajustes naturais são persistência de sessão no mobile, melhorias de validação e a ligação dos cadastros com CEP/estado/cidade no formulário de aluno.