import { registerAs } from '@nestjs/config';

import 'dotenv/config';

export const apiConfig = registerAs('api', () =>
  process.env.NODE_ENV === 'test' ? apiTestConfiguration : apiConfiguration,
);

const apiTestConfiguration = {
  port: Number(process.env.API_PORT) || 8082,
  nodeEnv: process.env.NODE_ENV || 'development',
  baseTimezone: process.env.BASE_TIMEZONE || 'America/Sao_Paulo',
};

const apiConfiguration = {
  port: Number(process.env.API_PORT) || 8082,
  nodeEnv: process.env.NODE_ENV || 'development',
  baseTimezone: process.env.BASE_TIMEZONE || 'America/Sao_Paulo',
};

export const databaseConfig = registerAs('database', () =>
  process.env.NODE_ENV === 'test'
    ? databaseTestConfiguration
    : databaseConfiguration,
);

const databaseTestConfiguration = {
  host: process.env.TEST_DATABASE_HOST,
  username: process.env.TEST_DATABASE_USER,
  password: process.env.TEST_DATABASE_PASSWORD,
  db: process.env.TEST_DATABASE_NAME,
  port: process.env.TEST_DATABASE_PORT,
  migrationsRun: process.env.TEST_DATABASE_MIGRATION_RUN === 'true',
  synchronize: process.env.TEST_DATABASE_SYNCHRONIZE === 'true',
};

const databaseConfiguration = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  db: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  migrationsRun: process.env.DATABASE_MIGRATION_RUN === 'true',
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
};
