import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Administrator } from './entities/administrator.entity';
import { HealthProfessional } from './entities/health-professional.entity';
import { Patient } from './entities/patient.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Administrator,
      HealthProfessional,
      Patient,
    ]),
  ],
})
export class UserModule {}
