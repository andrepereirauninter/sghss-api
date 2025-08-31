import { DataSource } from 'typeorm';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AdministratorService } from './administrator.service';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { PatientService } from './patient.service';
import { CreateUserPayload } from './payload/create-user.payload';
import { ProfessionalService } from './professional.service';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly administratorService: AdministratorService,
    private readonly professionalService: ProfessionalService,
    private readonly patientService: PatientService,
    private readonly dataSource: DataSource,
  ) {}

  async create(payload: CreateUserPayload) {
    const userExists = await this.repository.findOneBy({
      email: payload.email,
    });

    if (userExists) {
      throw new ConflictException(
        `User with email ${payload.email} already exists`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.repository.create(payload);
      const savedUser = await queryRunner.manager.save(user);

      switch (payload.role) {
        case UserRole.ADMIN:
          await this.administratorService.create(
            payload.administrator!,
            savedUser.id,
            queryRunner,
          );
          break;
        case UserRole.PROFESSIONAL:
          await this.professionalService.create(
            payload.professional!,
            savedUser.id,
            queryRunner,
          );
          break;
        case UserRole.PATIENT:
          await this.patientService.create(
            payload.patient!,
            savedUser.id,
            queryRunner,
          );
          break;
        default:
          throw new BadRequestException(`Unknown user role`);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findByIdWithRelations(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: {
        administrator: true,
        professional: true,
        patient: true,
      },
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.repository.findActiveByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    this.validatePassword(user, password);

    delete user.password;

    return user;
  }

  private validatePassword(user: User, password: string) {
    if (!user.comparePassword(password)) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
  }
}
