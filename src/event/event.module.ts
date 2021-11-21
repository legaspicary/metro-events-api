import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from "./entities/event.entity";
import { ParticipantService } from './participant/participant.service';
import { Participant } from './entities/participant.entity';
import { UserModule } from '../user/user.module';
import { NotificationService } from './notification/notification.service';

@Module({
  controllers: [EventController],
  providers: [EventService, ParticipantService, NotificationService],
  imports: [UserModule, TypeOrmModule.forFeature([Event, Participant])]
})
export class EventModule {}
