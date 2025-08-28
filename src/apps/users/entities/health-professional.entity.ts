import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { HealthProfessionalType } from '../enums/health-professional-type.enum';
import { User } from './user.entity';

@Entity('profissionais_de_saude')
export class HealthProfessional extends BaseEntity<HealthProfessional> {
  @Column({ unique: true, name: 'nome' })
  name: string;

  @Column({ name: 'especialidade' })
  speciality: string;

  @Column({ name: 'tipo' })
  type: HealthProfessionalType;

  @Column({ name: 'ativo' })
  active: boolean;

  @RelationId(
    (healthProfessional: HealthProfessional) => healthProfessional.user,
  )
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  user: User;
}
