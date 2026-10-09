import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/sequelize';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { PersonsController } from '../src/persons/persons.controller.js';
import { Person } from '../src/persons/person.model.js';
import { PersonsService } from '../src/persons/persons.service.js';
import { UsersController } from '../src/users/users.controller.js';
import { User } from '../src/users/user.model.js';
import { UsersService } from '../src/users/users.service.js';

describe('Registration routes (e2e)', () => {
  let app: INestApplication<App>;

  const createdPerson = {
    id: 'person-id',
    name: 'Ada Lovelace',
    cpf: '12345678901',
  };
  const createdUser = {
    id: 1,
    email: 'ada@example.com',
    personUuid: createdPerson.id,
    person: createdPerson,
  };
  const transaction = {};
  const persons = {
    create: vi.fn(),
    findAll: vi.fn(),
  };
  const users = {
    create: vi.fn(),
    findByPk: vi.fn(),
  };
  const sequelize = {
    transaction: vi.fn(async (callback: (value: object) => Promise<unknown>) =>
      callback(transaction),
    ),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    persons.create.mockResolvedValue(createdPerson);
    persons.findAll.mockResolvedValue([createdPerson]);
    users.create.mockResolvedValue(createdUser);
    users.findByPk.mockResolvedValue(createdUser);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PersonsController, UsersController],
      providers: [
        PersonsService,
        UsersService,
        { provide: getModelToken(Person), useValue: persons },
        { provide: getModelToken(User), useValue: users },
        { provide: getConnectionToken(), useValue: sequelize },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a person without creating a user', async () => {
    await request(app.getHttpServer())
      .post('/persons')
      .send({ name: ' Ada Lovelace ', cpf: '12345678901' })
      .expect(201)
      .expect(createdPerson);

    expect(persons.create).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      cpf: '12345678901',
    });
    expect(users.create).not.toHaveBeenCalled();
  });

  it('creates a user and its person in one transaction', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: ' Ada Lovelace ',
        cpf: '12345678901',
        email: ' ada@example.com ',
      })
      .expect(201)
      .expect({
        id: 1,
        email: 'ada@example.com',
        personUuid: createdPerson.id,
        person: createdPerson,
      });

    expect(sequelize.transaction).toHaveBeenCalledOnce();
    expect(persons.create).toHaveBeenCalledWith(
      { name: 'Ada Lovelace', cpf: '12345678901' },
      { transaction },
    );
    expect(users.create).toHaveBeenCalledWith(
      { email: 'ada@example.com', personUuid: createdPerson.id },
      { transaction },
    );
    expect(users.findByPk).toHaveBeenCalledWith(1, {
      include: [Person],
      transaction,
      rejectOnEmpty: true,
    });
  });

  it('rejects a user registration without a name', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'ada@example.com' })
      .expect(400);

    expect(users.create).not.toHaveBeenCalled();
    expect(sequelize.transaction).not.toHaveBeenCalled();
  });

  it('rejects a user registration without an email', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Ada Lovelace' })
      .expect(400);

    expect(users.create).not.toHaveBeenCalled();
    expect(sequelize.transaction).not.toHaveBeenCalled();
  });
});
