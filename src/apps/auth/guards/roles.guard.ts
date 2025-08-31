import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const hasRole = this.validateUserRole(user, requiredRoles);

    if (!hasRole) {
      throw new ForbiddenException(
        'Você não tem permissão para executar essa operação.',
      );
    }

    return true;
  }

  private validateUserRole(user: User, requiredRoles: UserRole[]) {
    return requiredRoles.some((role) => user.role === role);
  }
}
