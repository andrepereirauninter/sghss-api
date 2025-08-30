import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

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

  @Column({ name: 'usuario_id' })
  userId?: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  user?: User;
}
