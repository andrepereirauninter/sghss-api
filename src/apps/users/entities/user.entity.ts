import bcrypt from 'bcryptjs';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../enums/user-role.enum';
import { Administrator } from './administrator.entity';
import { Patient } from './patient.entity';
import { Professional } from './professional.entity';

@Entity('usuarios')
export class User extends BaseEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column({ select: false, name: 'senha' })
  password?: string;

  @Column({ name: 'ativo' })
  active: boolean;

  @Column({ name: 'perfil', type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToOne(() => Administrator, (administrator) => administrator.user, {
    cascade: true,
  })
  administrator: Administrator;

  @OneToOne(() => Professional, (professional) => professional.user, {
    cascade: true,
  })
  professional: Professional;

  @OneToOne(() => Patient, (patient) => patient.user, {
    cascade: true,
  })
  patient: Patient;

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
