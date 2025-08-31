import { isUUID } from 'class-validator';

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const paramName = metadata.data || 'parâmetro';

    if (!isUUID(value, 4)) {
      throw new BadRequestException(`${paramName} deve ser um UUID válido`);
    }
    return value;
  }
}
