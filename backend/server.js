const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./routes');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use(router);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'app-schollar-backend' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

app.listen(port, () => {
  console.log(`Backend Schollar executando em http://localhost:${port}`);
});