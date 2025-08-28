import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity()
export class User extends BaseEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column({ select: false, name: 'senha' })
  password: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'perfil' })
  role: UserRole;
}
