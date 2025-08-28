import { DataSource } from 'typeorm';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeormService implements OnModuleInit {
  private readonly logger = new Logger(TypeormService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.synchronize();
    await this.runMigrations();
  }

  async synchronize() {
    if (this.configService.get('database.synchronize')) {
      this.logger.log('Synchronizing database...');
      await this.dataSource.synchronize();
    }
  }

  async runMigrations() {
    if (this.configService.get('database.migrationsRun')) {
      this.logger.log('Running migrations...');
      await this.dataSource.runMigrations();
    }
  }
}
