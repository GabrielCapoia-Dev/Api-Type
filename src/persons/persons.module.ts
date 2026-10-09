import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PersonsController } from './persons.controller.js';
import { Person } from './person.model.js';
import { PersonsService } from './persons.service.js';

@Module({
  imports: [SequelizeModule.forFeature([Person])],
  controllers: [PersonsController],
  providers: [PersonsService],
})
export class PersonsModule {}
