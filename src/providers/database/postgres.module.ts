import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from './typeorm';
import { TypeormService } from './typeorm.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...config,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TypeormService],
})
export class PostgresProviderModule {}
