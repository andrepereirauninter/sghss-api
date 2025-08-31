import { validate } from 'class-validator';

import { passwordLength } from '../../constants/password-length';
import { IsValidPassword } from '../is-valid-password.decorator';

class TestPassword {
  @IsValidPassword()
  password: string;

  constructor(password: string) {
    this.password = password;
  }
}

describe('IsValidPassword', () => {
  it('should validate a correct password', async () => {
    const testObj = new TestPassword('Senha123@');
    const errors = await validate(testObj);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for password that is too short', async () => {
    const testObj = new TestPassword('Short1!');
    const errors = await validate(testObj);
    expect(errors.length).toBeGreaterThan(0);

    expect(errors[0].constraints?.isLength).toBe(
      `A senha deve ter entre ${passwordLength.min} e ${passwordLength.max} caracteres.`,
    );
  });

  it('should fail validation for password that is too long', async () => {
    const testObj = new TestPassword('ThisPasswordIsWayTooLong123!');
    const errors = await validate(testObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isLength).toBe(
      `A senha deve ter entre ${passwordLength.min} e ${passwordLength.max} caracteres.`,
    );
  });

  it('should fail validation for password without uppercase', async () => {
    const testObj = new TestPassword('senha123!');
    const errors = await validate(testObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.matches).toBe(
      'A senha deve conter pelo menos uma letra maiúscula.',
    );
  });

  it('should fail validation for password without lowercase', async () => {
    const testObj = new TestPassword('SENHA123!');
    const errors = await validate(testObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.matches).toBe(
      'A senha deve conter pelo menos uma letra minúscula.',
    );
  });

  it('should fail validation for password without number', async () => {
    const testObj = new TestPassword('SenhaSemNumero!');
    const errors = await validate(testObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.matches).toBe(
      'A senha deve conter pelo menos um número.',
    );
  });

  it('should fail validation for password without special character', async () => {
    const testObj = new TestPassword('Senha123SemEspecial');
    const errors = await validate(testObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.matches).toBe(
      'A senha deve conter pelo menos um caractere especial.',
    );
  });
});
