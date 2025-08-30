import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { ProfessionalType } from '../enums/professional-type.enum';
import { User } from './user.entity';

@Entity('profissionais')
export class Professional extends BaseEntity<Professional> {
  @Column({ unique: true, name: 'nome' })
  name: string;

  @Column({ name: 'especialidade' })
  speciality: string;

  @Column({ name: 'tipo', type: 'enum', enum: ProfessionalType })
  type: ProfessionalType;

  @Column({ name: 'ativo' })
  active: boolean;

  @Column({ name: 'usuario_id' })
  userId?: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  user?: User;
}
