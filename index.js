// DB Connection
import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

import express from 'express';

async function startServer() {
  const app = express();
  await require('./initializers').default({ expressApp: app });

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
}

startServer();