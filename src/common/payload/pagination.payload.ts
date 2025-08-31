import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationPayload {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'Número da pagina dos resultados',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    minimum: 1,
    default: 10,
    description: 'Quantidade de resultados por pagina',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
