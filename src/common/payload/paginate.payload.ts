import { ApiProperty } from '@nestjs/swagger';

export class PaginateOptionsDto {
  @ApiProperty({
    description: 'Página atual',
  })
  currentPage: number;

  @ApiProperty({
    description: 'Quantidade de itens por página',
  })
  limitPerPage: number;

  @ApiProperty({
    description: 'Quantidade total de itens no banco de dados',
  })
  totalItems: number;

  @ApiProperty({
    description: 'Página anterior',
  })
  previousPage: number | null;

  @ApiProperty({
    description: 'Página seguinte',
  })
  nextPage: number | null;
}

export class PaginatePayload<T> {
  @ApiProperty({
    description: 'Dados da página',
  })
  data: T[];

  @ApiProperty({
    description: 'Configurações de paginação',
  })
  pagination: PaginateOptionsDto;
}
