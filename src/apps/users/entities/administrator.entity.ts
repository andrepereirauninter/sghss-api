import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';

@Entity('administradores')
export class Administrator extends BaseEntity<Administrator> {
  @Column({ name: 'nome' })
  name: string;

  @Column({ name: 'usuario_id' })
  userId?: string;

  @OneToOne(() => User, (user) => user.administrator, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  user?: User;
}
