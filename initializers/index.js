import expressInitializer from './express';

export default async ({ expressApp }) => {
  await expressInitializer({ app: expressApp });
};