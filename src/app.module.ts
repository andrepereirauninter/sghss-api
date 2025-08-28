import { Module } from '@nestjs/common';

import { UserModule } from './apps/users/user.module';
import { CustomConfigModule } from './config/custom-config.module';
import { PostgresProviderModule } from './providers/database/postgres.module';
import { HealthModule } from './providers/health/health.module';

@Module({
  imports: [
    CustomConfigModule,
    PostgresProviderModule,
    HealthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
