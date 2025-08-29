import { Column, Entity, OneToOne, RelationId } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../users/entities/patient.entity';
import { Professional } from '../../users/entities/professional.entity';
import { Appointment } from './appointment.entity';

@Entity('prescricoes')
export class Prescription extends BaseEntity<Prescription> {
  @Column({ name: 'instrucoes', type: 'text' })
  instructions: string;

  @RelationId((prescription: Prescription) => prescription.appointment)
  appointmentId?: string;

  @OneToOne(() => Appointment)
  appointment?: Appointment;

  @RelationId((prescription: Prescription) => prescription.patient)
  patientId?: string;

  @OneToOne(() => Patient)
  patient?: Patient;

  @RelationId((prescription: Prescription) => prescription.professional)
  professionalId?: string;

  @OneToOne(() => Professional)
  professional?: Professional;
}
