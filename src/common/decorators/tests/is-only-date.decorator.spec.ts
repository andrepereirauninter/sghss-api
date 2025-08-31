import { validate } from 'class-validator';

import { isOnlyDateValidation } from '../../constants/is-only-date-validation';
import { IsOnlyDate } from '../is-only-date.decorator';

class TestDate {
  @IsOnlyDate()
  date: string;

  constructor(date: string) {
    this.date = date;
  }
}

describe('IsOnlyDate', () => {
  it('should validate correctly when the date is valid', async () => {
    const testDate = new TestDate('2024-01-01');
    const errors = await validate(testDate);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when the date is invalid', async () => {
    const testDate = new TestDate('01-01-2024');
    const errors = await validate(testDate);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.IsOnlyDate).toBe(
      isOnlyDateValidation.message,
    );
  });

  it('should fail validation for non-date strings', async () => {
    const testDate = new TestDate('not-a-date');
    const errors = await validate(testDate);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.IsOnlyDate).toBe(
      isOnlyDateValidation.message,
    );
  });

  it('should pass validation for other ISO date formats within range', async () => {
    const testDate = new TestDate('2030-12-31');
    const errors = await validate(testDate);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for ISO date with time', async () => {
    const testDate = new TestDate('2030-12-31T12:34:56');
    const errors = await validate(testDate);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.IsOnlyDate).toBe(
      isOnlyDateValidation.message,
    );
  });
});
