import { Module } from '@nestjs/common';

import { AppointmentModule } from './apps/appointments/appointment.module';
import { AuthModule } from './apps/auth/auth.module';
import { UnitModule } from './apps/units/unit.module';
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
    UnitModule,
    AppointmentModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
