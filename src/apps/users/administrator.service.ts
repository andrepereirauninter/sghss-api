import { Injectable } from '@nestjs/common';

import { AdministratorRepository } from './repositories/administrator.repository';

@Injectable()
export class AdministratorService {
  constructor(private readonly repository: AdministratorRepository) {}
}
