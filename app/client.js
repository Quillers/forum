const { Client } = require('pg');

// 'process' est une variable globale dispo partout dans le dossier
const client = new Client({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_LOGIN,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

client.connect();

module.exports = client;
