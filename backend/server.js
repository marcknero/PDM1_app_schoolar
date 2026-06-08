const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const router = require('./routes');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, 'public');
const apkPath = path.join(publicDir, 'downloads', 'app-schollar.apk');

app.use(cors());
app.use(express.json());
app.use(router);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'app-schollar-backend' });
});

app.get('/downloads/app-schollar.apk', (req, res) => {
  if (!fs.existsSync(apkPath)) {
    return res.status(404).json({
      message: 'APK ainda não publicado. Gere o build Android e coloque o arquivo em backend/public/downloads/app-schollar.apk.',
    });
  }

  res.download(apkPath, 'app-schollar.apk');
});

app.use(express.static(publicDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

app.listen(port, () => {
  console.log(`Backend Schollar executando em http://localhost:${port}`);
});