import expressInitializer from './express';
import knexInitializer from './knex';
import dependencyInjector from './dependency-injector';

export default async ({ expressApp }) => {
  const knexConnection = await knexInitializer();

  await dependencyInjector({ knexConnection });
  await expressInitializer({ app: expressApp });
};