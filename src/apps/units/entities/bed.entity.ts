import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { BedStatus } from '../enums/bed-status.enum';
import { Unit } from './unit.entity';

@Entity('leitos')
export class Bed extends BaseEntity<Bed> {
  @Column({ name: 'numero' })
  number: string;

  @Column()
  status: BedStatus;

  @Column({ name: 'unidade_id' })
  unitId: string;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unidade_id' })
  unit: Unit;
}
