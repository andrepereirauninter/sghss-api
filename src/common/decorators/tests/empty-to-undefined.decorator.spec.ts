import { plainToInstance } from 'class-transformer';
import { IsOptional, IsString, validateSync } from 'class-validator';

import { EmptyToUndefined } from '../empty-to-undefined.decorator';

class TestDto {
  @EmptyToUndefined()
  @IsOptional()
  @IsString()
  field?: string;
}

describe('EmptyToUndefined', () => {
  it('should keep non-empty string', () => {
    const input = { field: 'hello' };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBe('hello');
  });

  it('should trim and keep non-empty string', () => {
    const input = { field: '  hello  ' };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBe('hello');
  });

  it('should convert empty string to undefined', () => {
    const input = { field: '' };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBeUndefined();
  });

  it('should convert whitespace-only string to undefined', () => {
    const input = { field: '    ' };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBeUndefined();
  });

  it('should keep undefined as undefined', () => {
    const input = {};
    const result = plainToInstance(TestDto, input);
    expect(result.field).toBeUndefined();
  });

  it('should pass validation when empty string is transformed to undefined', () => {
    const input = { field: '   ' };
    const result = plainToInstance(TestDto, input);
    const errors = validateSync(result);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation if transformed value is not a string', () => {
    const input = { field: 123 };
    const result = plainToInstance(TestDto, input);
    const errors = validateSync(result);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isString).toBeDefined();
  });
});
