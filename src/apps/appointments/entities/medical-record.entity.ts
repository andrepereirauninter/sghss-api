import { Column, Entity, OneToOne, RelationId } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../users/entities/patient.entity';

@Entity('prontuarios')
export class MedicalRecord extends BaseEntity<MedicalRecord> {
  @Column({ name: 'descricao', type: 'text' })
  description: string;

  @RelationId((medicalRecord: MedicalRecord) => medicalRecord.patient)
  patientId?: string;

  @OneToOne(() => Patient)
  patient?: Patient;
}
