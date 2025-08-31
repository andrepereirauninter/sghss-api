import { plainToInstance } from 'class-transformer';

import { QueryStringToBoolean } from '../query-string-to-boolean.decorator';

class TestDto {
  @QueryStringToBoolean()
  field?: boolean;
}

describe('QueryStringToBoolean decorator', () => {
  it('should convert "true" string to true', () => {
    const input = { field: 'true' };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBe(true);
  });

  it('should convert "false" string to false', () => {
    const input = { field: 'false' };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBe(false);
  });

  it('should handle case-insensitive values', () => {
    const inputTrue = { field: 'TrUe' };
    const inputFalse = { field: 'FaLsE' };
    const resultTrue = plainToInstance(TestDto, inputTrue);
    const resultFalse = plainToInstance(TestDto, inputFalse);
    expect(resultTrue.field).toBe(true);
    expect(resultFalse.field).toBe(false);
  });

  it('should trim spaces and convert correctly', () => {
    const inputTrue = { field: '  true  ' };
    const inputFalse = { field: '  false  ' };
    const resultTrue = plainToInstance(TestDto, inputTrue);
    const resultFalse = plainToInstance(TestDto, inputFalse);
    expect(resultTrue.field).toBe(true);
    expect(resultFalse.field).toBe(false);
  });

  it('should convert empty string to undefined', () => {
    const input = { field: '' };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBeUndefined();
  });

  it('should convert string with only spaces to undefined', () => {
    const input = { field: '   ' };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBeUndefined();
  });

  it('should keep boolean values as is', () => {
    const inputTrue = { field: true as any };
    const inputFalse = { field: false as any };
    const resultTrue = plainToInstance(TestDto, inputTrue);
    const resultFalse = plainToInstance(TestDto, inputFalse);
    expect(resultTrue.field).toBe(true);
    expect(resultFalse.field).toBe(false);
  });

  it('should keep undefined as is', () => {
    const input = { field: undefined };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBeUndefined();
  });

  it('should keep null as is', () => {
    const input = { field: null as any };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBeNull();
  });

  it('should leave other strings unchanged', () => {
    const input = { field: 'yes' as any };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBe('yes');
  });
});
