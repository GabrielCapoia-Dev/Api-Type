import { Module } from '@nestjs/common';
import { AppController } from '../Controller/app.controller.js';
import { AppService } from '../Service/app.service.js';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      models: [],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
