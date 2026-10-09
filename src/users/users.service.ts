import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Person } from '../persons/person.model.js';
import { CreateUserDto } from '../registrations/create-user.dto.js';
import { PersonRegistrationService } from '../registrations/person-registration.service.js';
import { User } from './user.model.js';

@Injectable()
export class UsersService extends PersonRegistrationService<
  CreateUserDto,
  User
> {
  constructor(
    @InjectModel(Person) private readonly persons: typeof Person,
    @InjectModel(User) private readonly users: typeof User,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {
    super();
  }

  create(input: CreateUserDto): Promise<User> {
    const person = this.personData(input);

    if (
      !input ||
      typeof input.email !== 'string' ||
      input.email.trim().length === 0
    ) {
      throw new BadRequestException('email is required');
    }

    return this.sequelize.transaction(async (transaction) => {
      const createdPerson = await this.persons.create(person, { transaction });
      const createdUser = await this.users.create(
        {
          email: input.email.trim(),
          personUuid: createdPerson.id,
        },
        { transaction },
      );

      return this.users.findByPk(createdUser.id, {
        include: [Person],
        transaction,
        rejectOnEmpty: true,
      });
    });
  }
}
