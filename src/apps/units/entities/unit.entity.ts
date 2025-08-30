import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { Professional } from '../../users/entities/professional.entity';
import { UnitType } from '../../users/enums/unit-type.enum';

@Entity('unidades')
export class Unit extends BaseEntity<Unit> {
  @Column({ unique: true, name: 'codigo' })
  code: string;

  @Column({ name: 'nome' })
  name: string;

  @Column({ name: 'endereco' })
  address: string;

  @Column({ name: 'tipo', type: 'enum', enum: UnitType })
  type: UnitType;

  @Column({ name: 'ativo' })
  active: boolean;

  @ManyToMany(() => Professional)
  @JoinTable({
    name: 'unidades_profissionais',
    joinColumn: { name: 'unidade_id' },
    inverseJoinColumn: { name: 'profissional_id' },
  })
  professionals: Professional[];
}
