import {
  BaseEntity as TypeBaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity<Entity> extends TypeBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'criado_em',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    select: false,
    name: 'atualizado_em',
  })
  updatedAt: Date;

  constructor(data?: Partial<Entity>) {
    super();
    Object.assign(this, data ?? {});
  }
}
