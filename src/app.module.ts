import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'db',
      port: 3306,
      username: '${DATABASE_USER}',
      password: '${DATABASE_PASSWORD}',
      database: '${DATABASE_NAME}',
      models: [],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
