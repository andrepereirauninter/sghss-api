import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { apiConfig, databaseConfig } from '../../config/custom-config';

const isTestEnvironment = apiConfig().nodeEnv === 'test';

const entitiesPath = isTestEnvironment
  ? 'src/**/*.entity{.ts,.js}'
  : 'dist/**/*.entity{.ts,.js}';

const migrationsPath = isTestEnvironment
  ? 'src/migrations/*{.ts,.js}'
  : 'dist/**/migrations/*{.ts,.js}';

export const config = {
  type: 'postgres' as const,
  host: databaseConfig().host,
  port: Number(databaseConfig().port),
  username: databaseConfig().username,
  password: databaseConfig().password,
  database: databaseConfig().db,
  dropSchema: isTestEnvironment,
  migrationsTableName: 'migrations' as const,
  migrationsTransactionMode: 'each' as const,
  installExtensions: true,
  uuidExtension: 'uuid-ossp' as const,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [entitiesPath],
  migrations: [migrationsPath],
  autoLoadEntities: true,
  synchronize: true,
  logging: false,
};

export const connectionSource = new DataSource(config as DataSourceOptions);
