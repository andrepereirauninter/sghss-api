import { plainToInstance } from 'class-transformer';

import { QueryStringToArray } from '../query-string-to-array.decorator';

class TestDto {
  @QueryStringToArray()
  field: string[];
}

describe('QueryStringToArray decorator', () => {
  it('should keep array as is', () => {
    const input = { field: ['a', 'b', 'c'] };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toEqual(['a', 'b', 'c']);
  });

  it('should convert single string to array with one element', () => {
    const input = { field: 'singleValue' };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toEqual(['singleValue']);
  });

  it('should handle undefined by wrapping in array', () => {
    const input = { field: undefined };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toEqual([undefined]);
  });

  it('should handle null by wrapping in array', () => {
    const input = { field: null };
    const result = plainToInstance(TestDto, input);
    expect(result.field).toEqual([null]);
  });
});
