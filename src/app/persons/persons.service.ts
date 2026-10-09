import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Person } from './person.model.js';
import { CreatePersonDto } from '../registrations/create-person.dto.js';
import { PersonRegistrationService } from '../registrations/person-registration.service.js';

@Injectable()
export class PersonsService extends PersonRegistrationService<
  CreatePersonDto,
  Person
> {
  constructor(@InjectModel(Person) private readonly persons: typeof Person) {
    super();
  }

  create(input: CreatePersonDto): Promise<Person> {
    return this.persons.create(this.personData(input));
  }

  findAll(): Promise<Person[]> {
    return this.persons.findAll();
  }
}
