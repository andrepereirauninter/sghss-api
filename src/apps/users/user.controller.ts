import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserPayload } from './payload/create-user.payload';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() payload: CreateUserPayload) {
    return this.service.create(payload);
  }
}
