const { Pool } = require('pg');
require('dotenv').config();

function shouldUseSsl(connectionString) {
  if (process.env.PGSSL === 'true') {
    return true;
  }

  if (process.env.NODE_ENV === 'production') {
    return true;
  }

  return /render\.com|amazonaws\.com|rds\.amazonaws/.test(connectionString || '');
}

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: shouldUseSsl(process.env.DATABASE_URL) ? { rejectUnauthorized: false } : undefined,
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT || 5432),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'schollar',
      }
);

module.exports = pool;