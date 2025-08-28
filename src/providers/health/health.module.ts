import { Module } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@ApiTags('Health')
@Module({
  imports: [
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 1000,
      errorLogStyle: 'pretty',
    }),
  ],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
