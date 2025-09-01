import { INestApplication } from '@nestjs/common';

import { AppointmentType } from '../../../apps/appointments/enums/appointment-type.enum';
import { AppointmentRepository } from '../../../apps/appointments/repositories/appointment.repository';
import { Unit } from '../../../apps/units/entities/unit.entity';
import { Patient } from '../../../apps/users/entities/patient.entity';
import { Professional } from '../../../apps/users/entities/professional.entity';

export function createAppointmentMock({
  app,
  medic,
  patient,
  unit,
  notes = 'any_notes',
  type = AppointmentType.IN_PERSON,
}: {
  app: INestApplication;
  medic: Professional;
  patient: Patient;
  unit: Unit;
  notes?: string;
  type?: AppointmentType;
}) {
  const repository = app.get(AppointmentRepository);

  return repository.save({
    medic,
    patient,
    unit,
    type,
    date: new Date(),
    notes,
  });
}
