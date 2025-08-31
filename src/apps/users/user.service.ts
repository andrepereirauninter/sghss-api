import {
  BadRequestException,
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
import { UpdateAdministratorPayload } from './payload/update-administrator.payload';
import { UpdatePasswordPayload } from './payload/update-password.payload';
import { UpdatePatientPayload } from './payload/update-patient.payload';
import { UpdateProfissionalPayload } from './payload/update-profissional.payload';
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

    if (!payload.acceptedTerms) {
      throw new BadRequestException(
        'O usuário deve aceitar os termos de uso do sistema.',
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
    return this.repository.findByIdWithRelations(id);
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

  async updateAdministrator(id: string, payload: UpdateAdministratorPayload) {
    const currentAdmin = await this.repository.findAdministratorById(id);

    if (!currentAdmin) {
      throw new NotFoundException(
        `O administrador com ID ${id} não foi encontrado.`,
      );
    }

    if (payload.email !== currentAdmin.email) {
      const userExists = await this.repository.findOneBy({
        email: payload.email,
      });

      if (userExists) {
        throw new ConflictException(
          `Um usuário com o email ${payload.email} já existe.`,
        );
      }
    }

    const administratorToUpdate = {
      ...currentAdmin.administrator,
      name: payload.name,
    };

    const userToUpdate = {
      ...currentAdmin,
      ...payload,
      administrator: administratorToUpdate,
    };

    await this.repository.save(userToUpdate);
  }

  async updatePatient(id: string, payload: UpdatePatientPayload) {
    const currentPatient = await this.repository.findPatientById(id);

    if (!currentPatient) {
      throw new NotFoundException(
        `O paciente com ID ${id} não foi encontrado.`,
      );
    }

    if (payload.email !== currentPatient.email) {
      const userExists = await this.repository.findOneBy({
        email: payload.email,
      });

      if (userExists) {
        throw new ConflictException(
          `O paciente com o email ${payload.email} já existe.`,
        );
      }
    }

    if (payload.cpf !== currentPatient.patient.cpf) {
      const patientExists = await this.patientService.findByCpf(payload.cpf);

      if (patientExists) {
        throw new ConflictException(
          `O paciente com o cpf ${payload.cpf} já existe.`,
        );
      }
    }

    const patientToUpdate = {
      ...currentPatient.patient,
      name: payload.name,
      cpf: payload.cpf,
      birthDate: payload.birthDate,
      contact: payload.contact,
    };

    const userToUpdate = {
      ...currentPatient,
      ...payload,
      patient: patientToUpdate,
    };

    await this.repository.save(userToUpdate);
  }

  async updateProfessional(id: string, payload: UpdateProfissionalPayload) {
    const currentProfessional = await this.repository.findProfessionalById(id);

    if (!currentProfessional) {
      throw new NotFoundException(
        `O profissional de saúde com ID ${id} não foi encontrado.`,
      );
    }

    if (payload.email !== currentProfessional.email) {
      const userExists = await this.repository.findOneBy({
        email: payload.email,
      });

      if (userExists) {
        throw new ConflictException(
          `O profissional de saúde com o email ${payload.email} já existe.`,
        );
      }
    }

    const professionalToUpdate = {
      ...currentProfessional.professional,
      name: payload.name,
      speciality: payload.speciality,
      type: payload.type,
    };

    const userToUpdate = {
      ...currentProfessional,
      ...payload,
      professional: professionalToUpdate,
    };

    await this.repository.save(userToUpdate);
  }

  async updatePassword(id: string, payload: UpdatePasswordPayload) {
    const user = await this.repository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`O usuário com ID ${id} não foi encontrado.`);
    }

    if (!user.comparePassword(payload.oldPassword)) {
      throw new BadRequestException('A senha antiga está incorreta.');
    }

    user.password = payload.newPassword;

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
