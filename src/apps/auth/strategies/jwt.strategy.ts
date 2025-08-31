import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UserService } from '../../users/user.service';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwtSecret')!,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findByIdWithRelations(payload.id);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return user;
  }
}
