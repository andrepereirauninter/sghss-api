import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

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

  @Column({ name: 'status', type: 'enum', enum: AppointmentStatus })
  status: AppointmentStatus;

  @Column({ name: 'tipo', type: 'enum', enum: AppointmentType })
  type: AppointmentType;

  @Column({ name: 'observacoes', type: 'text' })
  notes: string;

  @ManyToMany(() => Professional)
  @JoinTable({
    name: 'consultas_medicos',
    joinColumn: {
      name: 'consulta_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'medico_id',
      referencedColumnName: 'id',
    },
  })
  medic?: Professional;

  @ManyToMany(() => Patient)
  @JoinTable({
    name: 'consultas_pacientes',
    joinColumn: {
      name: 'consulta_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'paciente_id',
      referencedColumnName: 'id',
    },
  })
  patient?: Patient;

  @ManyToMany(() => Unit)
  @JoinTable({
    name: 'consultas_unidades',
    joinColumn: {
      name: 'consulta_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'unidade_id',
      referencedColumnName: 'id',
    },
  })
  unit?: Unit;
}
