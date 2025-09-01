import { validate } from 'class-validator';

import { IsCpf } from '../is-cpf.decorator';

class TestClass {
  @IsCpf()
  cpf: string;

  constructor(cpf: string) {
    this.cpf = cpf;
  }
}

describe('IsCpf decorator', () => {
  it('should validate a correct CPF', async () => {
    const model = new TestClass('529.982.247-25');
    const errors = await validate(model);
    expect(errors).toHaveLength(0);
  });

  it('should invalidate an incorrect CPF', async () => {
    const model = new TestClass('123.456.789-00');
    const errors = await validate(model);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchObject({
      IsCpfConstraint: 'CPF inválido',
    });
  });

  it('should invalidate a CPF with wrong length', async () => {
    const model = new TestClass('123456789');
    const errors = await validate(model);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchObject({
      IsCpfConstraint: 'CPF inválido',
    });
  });

  it('should invalidate a CPF with all digits equal', async () => {
    const model = new TestClass('11111111111');
    const errors = await validate(model);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchObject({
      IsCpfConstraint: 'CPF inválido',
    });
  });

  it('should invalidate an empty CPF', async () => {
    const model = new TestClass('');
    const errors = await validate(model);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchObject({
      IsCpfConstraint: 'CPF inválido',
    });
  });
});
