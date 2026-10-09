import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Person } from '../persons/person.model.js';
import { UsersController } from './users.controller.js';
import { User } from './user.model.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [SequelizeModule.forFeature([Person, User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
