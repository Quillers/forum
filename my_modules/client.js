/*---- Partie avec DB postgreSQL ------*/
  
const { Client } = require('pg');



// 'process' est une variable globale dispo partout dans le dossier
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_LOGIN,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

client.connect();

module.exports = client;