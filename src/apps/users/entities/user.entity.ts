import bcrypt from 'bcryptjs';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity('usuarios')
export class User extends BaseEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column({ select: false, name: 'senha' })
  password: string;

  @Column({ name: 'ativo' })
  active: boolean;

  @Column({ name: 'perfil' })
  role: UserRole;

  @BeforeInsert()
  hashPassword(): void {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  @BeforeUpdate()
  hash(): void {
    this.hashPassword();
  }

  comparePassword(attempt: string): boolean {
    if (!this.password) {
      return false;
    }
    return bcrypt.compareSync(attempt, this.password);
  }
}
