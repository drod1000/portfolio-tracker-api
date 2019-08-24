import expressInitializer from './express';
import knexInitializer from './knex';

export default async ({ expressApp }) => {
  await knexInitializer();
  await expressInitializer({ app: expressApp });
};