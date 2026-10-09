import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../registrations/create-user.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() input: CreateUserDto) {
    return this.usersService.create(input);
  }
}
