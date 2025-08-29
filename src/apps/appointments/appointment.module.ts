import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Appointment } from './entities/appointment.entity';
import { Exam } from './entities/exam.entity';
import { MedicalRecord } from './entities/medical-record.entity';
import { Prescription } from './entities/prescription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Exam, MedicalRecord, Prescription]),
  ],
})
export class AppointmentModule {}
