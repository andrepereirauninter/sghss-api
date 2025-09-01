import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { Unit } from '../../units/entities/unit.entity';
import { Patient } from '../../users/entities/patient.entity';
import { Professional } from '../../users/entities/professional.entity';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { AppointmentType } from '../enums/appointment-type.enum';

@Entity('consultas')
export class Appointment extends BaseEntity<Appointment> {
  @Column({ name: 'data_hora', type: 'timestamp with time zone' })
  date: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({ name: 'tipo', type: 'enum', enum: AppointmentType })
  type: AppointmentType;

  @Column({ name: 'observacoes', type: 'text' })
  notes: string;

  @ManyToOne(() => Professional)
  @JoinColumn({ name: 'medico_id' })
  medic?: Professional;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'paciente_id' })
  patient?: Patient;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unidade_id' })
  unit?: Unit;
}
