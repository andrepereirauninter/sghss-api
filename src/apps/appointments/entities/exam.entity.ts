import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('exames')
export class Exam extends BaseEntity<Exam> {
  @Column({ name: 'tipo' })
  type: string;

  @Column({ name: 'resultado', nullable: true })
  result: string;

  @Column({
    name: 'data_hora',
    type: 'timestamp with time zone',
    nullable: true,
  })
  date: Date;

  @Column({
    name: 'data_resultado',
    type: 'timestamp with time zone',
    nullable: true,
  })
  resultDate: Date;
}
