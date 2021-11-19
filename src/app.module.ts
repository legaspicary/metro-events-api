import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { readFileSync } from 'fs';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { PromotionRequest } from './user/entities/promtotion-request.entity';
import { Event } from './event/entities/event.entity';
import { Notification } from './event/entities/notification.entity';
import { Participant } from './event/entities/participant.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'metroevents',
      entities: [User, PromotionRequest, Event, Notification, Participant],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
        ca: [readFileSync('DigiCertGlobalRootCA.crt.pem', 'utf8')],
      },
    }),
    UserModule,
    EventModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
