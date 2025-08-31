import { Transform } from 'class-transformer';

export function QueryStringToArray() {
  return Transform(({ value }) =>
    value && Array.isArray(value) ? value : [value],
  );
}
