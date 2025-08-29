import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';

@Entity('pacientes')
export class Patient extends BaseEntity<Patient> {
  @Column()
  cpf: string;

  @Column({ name: 'nome' })
  name: string;

  @Column({ name: 'data_nascimento' })
  birthDate: string;

  @Column({ name: 'contato' })
  contact: string;

  @Column({ name: 'ativo' })
  active: boolean;

  @RelationId((patient: Patient) => patient.user)
  userId?: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  user?: User;
}
