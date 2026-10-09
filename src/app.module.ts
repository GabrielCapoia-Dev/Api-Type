import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PersonsModule } from './app/persons/persons.module.js';
import { Person } from './app/persons/person.model.js';
import { User } from './app/users/user.model.js';
import { UsersModule } from './app/users/users.module.js';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
          throw new Error('DATABASE_URL must be configured');
        }

        const url = new URL(connectionString);
        const database = decodeURIComponent(url.pathname.slice(1));

        if (url.protocol !== 'mysql:' || !url.hostname || !database) {
          throw new Error('DATABASE_URL must be a valid MySQL connection URL');
        }

        return {
          dialect: 'mysql',
          host: url.hostname,
          port: url.port ? Number(url.port) : 3306,
          username: decodeURIComponent(url.username),
          password: decodeURIComponent(url.password),
          database,
          models: [Person, User],
          autoLoadModels: true,
          synchronize: true,
        };
      },
    }),
    PersonsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
