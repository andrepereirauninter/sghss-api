import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Administrator } from './entities/administrator.entity';
import { Patient } from './entities/patient.entity';
import { Professional } from './entities/professional.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Administrator, Professional, Patient]),
  ],
})
export class UserModule {}
