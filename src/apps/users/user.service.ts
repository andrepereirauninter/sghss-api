import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { PatientService } from './patient.service';
import { CreateUserPayload } from './payload/create-user.payload';
import { FilterAllUsersPayload } from './payload/filter-all-users.payload';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly patientService: PatientService,
  ) {}

  findAll(payload: FilterAllUsersPayload) {
    return this.repository.findAll(payload);
  }

  async create(payload: CreateUserPayload) {
    const userExists = await this.repository.findOneBy({
      email: payload.email,
    });

    if (userExists) {
      throw new ConflictException(
        `Um usuário com o email ${payload.email} já existe.`,
      );
    }

    if (payload.role === UserRole.PATIENT) {
      const patientExists = await this.patientService.findByCpf(
        payload.patient!.cpf,
      );

      if (patientExists) {
        throw new ConflictException(
          `Um usuário com o cpf ${payload.patient?.cpf} já existe.`,
        );
      }
    }

    const user = this.repository.create(payload);
    await this.repository.save(user);
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

  async getDetails(id: string) {
    const user = await this.repository.findDetails(id);

    if (!user) {
      throw new NotFoundException(`O usuário com ID ${id} não foi encontrado.`);
    }

    return user;
  }

  async activate(id: string) {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`O usuário com ID ${id} não foi encontrado.`);
    }

    user.active = true;
    await this.repository.save(user);
  }

  async deactivate(id: string) {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`O usuário com ID ${id} não foi encontrado.`);
    }

    user.active = false;
    await this.repository.save(user);
  }

  async remove(id: string) {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`O usuário com ID ${id} não foi encontrado.`);
    }

    await this.repository.delete(id);
  }
}
