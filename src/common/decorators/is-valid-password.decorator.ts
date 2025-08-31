import { Length, Matches } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

import { passwordLength } from '../constants/password-length';

export function IsValidPassword() {
  return applyDecorators(
    Length(passwordLength.min, passwordLength.max, {
      message: `A senha deve ter entre ${passwordLength.min} e ${passwordLength.max} caracteres.`,
    }),
    Matches(/[A-Z]/, {
      message: 'A senha deve conter pelo menos uma letra maiúscula.',
    }),
    Matches(/[a-z]/, {
      message: 'A senha deve conter pelo menos uma letra minúscula.',
    }),
    Matches(/\d/, {
      message: 'A senha deve conter pelo menos um número.',
    }),
    Matches(/[@#$!%^&*()_+{}[\]:;<>,.?~\\/-]/, {
      message: 'A senha deve conter pelo menos um caractere especial.',
    }),
  );
}
