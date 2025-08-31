import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';

@Entity('pacientes')
export class Patient extends BaseEntity<Patient> {
  @Column({ unique: true })
  cpf: string;

  @Column({ name: 'nome' })
  name: string;

  @Column({ name: 'data_nascimento' })
  birthDate: string;

  @Column({ name: 'contato' })
  contact: string;

  @Column({ name: 'usuario_id' })
  userId?: string;

  @OneToOne(() => User, (user) => user.patient, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  user?: User;
}
