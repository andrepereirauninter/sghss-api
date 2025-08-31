import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { apiConfig, authConfig, databaseConfig } from './custom-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig, databaseConfig, authConfig],
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        API_PORT: Joi.number().optional(),
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
        BASE_TIMEZONE: Joi.string().optional(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_MIGRATION_RUN: Joi.boolean().optional(),
        DATABASE_SYNCHRONIZE: Joi.string().optional(),
        TEST_DATABASE_PORT: Joi.number().required(),
        TEST_DATABASE_USER: Joi.string().required(),
        TEST_DATABASE_PASSWORD: Joi.string().required(),
        TEST_DATABASE_HOST: Joi.string().required(),
        TEST_DATABASE_NAME: Joi.string().required(),
        TEST_DATABASE_MIGRATION_RUN: Joi.boolean().optional(),
        TEST_DATABASE_SYNCHRONIZE: Joi.string().optional(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
    }),
  ],
})
export class CustomConfigModule {}
