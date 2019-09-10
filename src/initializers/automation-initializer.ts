import knexInitializer from './knex';
import dependencyInjector from './dependency-injector';

export default async () => {
  const knexConnection = await knexInitializer();
  await dependencyInjector({ knexConnection });
};