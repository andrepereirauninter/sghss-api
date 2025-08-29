import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { ProfessionalType } from '../enums/professional-type.enum';
import { User } from './user.entity';

@Entity('profissionais')
export class Professional extends BaseEntity<Professional> {
  @Column({ unique: true, name: 'nome' })
  name: string;

  @Column({ name: 'especialidade' })
  speciality: string;

  @Column({ name: 'tipo' })
  type: ProfessionalType;

  @Column({ name: 'ativo' })
  active: boolean;

  @RelationId((professional: Professional) => professional.user)
  userId?: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  user?: User;
}
