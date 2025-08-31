import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { LoginPayload } from './payload/login.payload';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(payload: LoginPayload) {
    const { email, password } = payload;

    const user = await this.userService.validateUser(email, password);

    const formattedPayload = this.formatUserPayload(user);
    const token = this.generateToken(formattedPayload);

    return {
      user: formattedPayload,
      token,
    };
  }

  private generateToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.jwtExpiresIn'),
      secret: this.configService.get('auth.jwtSecret'),
    });
  }

  private formatUserPayload(user: User): JwtPayload {
    return {
      id: user.id,
      email: user.email,
      active: user.active,
      role: user.role,
      administrator: {
        id: user.administrator?.id,
        name: user.administrator?.name,
      },
      professional: {
        id: user.professional?.id,
        name: user.professional?.name,
        type: user.professional?.type,
        speciality: user.professional?.speciality,
      },
      patient: {
        id: user.patient?.id,
        name: user.patient?.name,
        cpf: user.patient?.cpf,
        birthDate: user.patient?.birthDate,
        contact: user.patient?.contact,
      },
    };
  }
}
