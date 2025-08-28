import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { HealthProfessional } from '../../users/entities/health-professional.entity';
import { UnitType } from '../../users/enums/unit-type.enum';

@Entity('unidades')
export class Unit extends BaseEntity<Unit> {
  @Column({ unique: true, name: 'codigo' })
  code: string;

  @Column({ name: 'nome' })
  name: string;

  @Column({ name: 'endereco' })
  address: string;

  @Column({ name: 'tipo' })
  type: UnitType;

  @Column({ name: 'ativo' })
  active: boolean;

  @ManyToMany(() => HealthProfessional)
  @JoinTable({
    name: 'unidades_profissionais_de_saude',
    joinColumn: { name: 'unidade_id' },
    inverseJoinColumn: { name: 'profissional_de_saude_id' },
  })
  healthProfessionals: HealthProfessional[];
}
