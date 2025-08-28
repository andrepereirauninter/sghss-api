import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';

@Entity('administradores')
export class Administrator extends BaseEntity<Administrator> {
  @Column({ name: 'nome' })
  name: string;

  @Column({ name: 'ativo' })
  active: boolean;

  @RelationId((administrator: Administrator) => administrator.user)
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  user: User;
}
