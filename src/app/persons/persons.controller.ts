import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePersonDto } from '../registrations/create-person.dto.js';
import { PersonsService } from './persons.service.js';

@Controller('persons/')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  create(@Body() input: CreatePersonDto) {
    return this.personsService.create(input);
  }

  @Get('find-all')
  findAll() {
    return this.personsService.findAll();
  }
}
