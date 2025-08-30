import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../users/entities/patient.entity';

@Entity('prontuarios')
export class MedicalRecord extends BaseEntity<MedicalRecord> {
  @Column({ name: 'descricao', type: 'text' })
  description: string;

  @Column({ name: 'paciente_id' })
  patientId?: string;

  @OneToOne(() => Patient)
  @JoinColumn({ name: 'paciente_id' })
  patient?: Patient;
}
