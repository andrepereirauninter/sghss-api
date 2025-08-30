import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../users/entities/patient.entity';
import { Professional } from '../../users/entities/professional.entity';
import { Appointment } from './appointment.entity';

@Entity('prescricoes')
export class Prescription extends BaseEntity<Prescription> {
  @Column({ name: 'instrucoes', type: 'text' })
  instructions: string;

  @Column({ name: 'agendamento_id' })
  appointmentId?: string;

  @OneToOne(() => Appointment)
  @JoinColumn({ name: 'agendamento_id' })
  appointment?: Appointment;

  @Column({ name: 'paciente_id' })
  patientId?: string;

  @OneToOne(() => Patient)
  @JoinColumn({ name: 'paciente_id' })
  patient?: Patient;

  @Column({ name: 'profissional_id' })
  professionalId?: string;

  @OneToOne(() => Professional)
  @JoinColumn({ name: 'profissional_id' })
  professional?: Professional;
}
