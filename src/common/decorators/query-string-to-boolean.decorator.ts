import { Transform } from 'class-transformer';

export function QueryStringToBoolean() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return undefined;

      const normalized = trimmed.toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
    }
    return value;
  });
}
