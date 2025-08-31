import { UserRole } from '../../users/enums/user-role.enum';

export type JwtPayload = {
  id: string;
  email: string;
  active: boolean;
  role: UserRole;
  administrator?: {
    id: string;
    name: string;
  };
  patient?: {
    id: string;
    cpf: string;
    name: string;
    birthDate: string;
    contact: string;
  };
  professional?: {
    id: string;
    name: string;
    speciality: string;
    type: string;
  };
};
