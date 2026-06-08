# App Schollar

Projeto para avaliação de aprendizagem e aprendizagem prática da matéria de Programação Para Dispositivos Móveis, ministrada pelo Professor: André Olimpio - durante o curso de formação em Desenvolvimento de Software Multiplataforma, pela universidade FATEC - Jacareí.

## Aluno:
### Marcos Oliveira
4º DSM 2026.

O projeto encontra-se neste mesmo repositório em [/app_schollar](./app_schollar/), onde encontrará outro README.

## Deploy no Render

Para publicar o banco PostgreSQL, a API e disponibilizar o APK para download dos usuários, siga o guia:

**[app_schollar/DEPLOY_RENDER.md](./app_schollar/DEPLOY_RENDER.md)**

Resumo rápido:

1. Push no GitHub → Render **Blueprint** (usa `render.yaml` na raiz)
2. Anote a URL da API (ex.: `https://app-schollar-api.onrender.com`)
3. Gere o APK com `eas build -p android` em `app_schollar/`
4. Coloque o APK em `backend/public/downloads/app-schollar.apk` e faça redeploy
5. Usuários baixam em `https://SUA-URL.onrender.com/`