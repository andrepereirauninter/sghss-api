import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitModule } from '../units/unit.module';
import { UserModule } from '../users/user.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entities/appointment.entity';
import { Exam } from './entities/exam.entity';
import { MedicalRecord } from './entities/medical-record.entity';
import { Prescription } from './entities/prescription.entity';
import { AppointmentRepository } from './repositories/appointment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Exam, MedicalRecord, Prescription]),
    UserModule,
    UnitModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentRepository],
})
export class AppointmentModule {}
