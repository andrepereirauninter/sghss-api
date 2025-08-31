import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCpfConstraint implements ValidatorConstraintInterface {
  validate(cpf: string) {
    if (!cpf) return false;

    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cleaned.charAt(i)) * (10 - i);
    let firstDigit = (sum * 10) % 11;
    if (firstDigit === 10) firstDigit = 0;
    if (firstDigit !== parseInt(cleaned.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cleaned.charAt(i)) * (11 - i);
    let secondDigit = (sum * 10) % 11;
    if (secondDigit === 10) secondDigit = 0;
    return secondDigit === parseInt(cleaned.charAt(10));
  }

  defaultMessage() {
    return 'CPF inválido';
  }
}

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsCpfConstraint,
    });
  };
}
