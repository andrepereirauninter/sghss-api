import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../users/user.module';
import { Bed } from './entities/bed.entity';
import { Unit } from './entities/unit.entity';
import { UnitRepository } from './repositories/unit.repository';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Unit, Bed]), UserModule],
  controllers: [UnitController],
  providers: [UnitService, UnitRepository],
  exports: [UnitService],
})
export class UnitModule {}
