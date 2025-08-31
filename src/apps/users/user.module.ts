import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdministratorService } from './administrator.service';
import { Administrator } from './entities/administrator.entity';
import { Patient } from './entities/patient.entity';
import { Professional } from './entities/professional.entity';
import { User } from './entities/user.entity';
import { PatientService } from './patient.service';
import { ProfessionalService } from './professional.service';
import { AdministratorRepository } from './repositories/administrator.repository';
import { PatientRepository } from './repositories/patient.repository';
import { ProfessionalRepository } from './repositories/professional.repository';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Administrator, Professional, Patient]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    AdministratorService,
    AdministratorRepository,
    ProfessionalService,
    ProfessionalRepository,
    PatientService,
    PatientRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
