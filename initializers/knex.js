require('dotenv').config();
import knex from 'knex';

export default async() => {
  const connection = knex({
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    }
  });

  return connection;
};