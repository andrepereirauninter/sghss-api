import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUnitPayload } from './payload/create-unit.payload';
import { FilterAllUnitsPayload } from './payload/filter-all-units.payload';
import { FilterSearchUnitsPayload } from './payload/filter-search-units.payload';
import { UnitService } from './unit.service';

@Controller('units')
@ApiTags('Unit')
export class UnitController {
  constructor(private readonly service: UnitService) {}

  @Get()
  findAll(@Query() payload: FilterAllUnitsPayload) {
    return this.service.findAll(payload);
  }

  @Get('search')
  search(@Query() payload: FilterSearchUnitsPayload) {
    return this.service.search(payload);
  }

  @Post()
  create(@Body() payload: CreateUnitPayload) {
    return this.service.create(payload);
  }

  @Get(':id')
  findDetails(@Param('id') id: string) {
    return this.service.findDetails(id);
  }
}
