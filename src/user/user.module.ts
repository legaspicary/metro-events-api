import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PromotionRequest } from './entities/promtotion-request.entity';
import { RequestService } from './request/request.service';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification/notification.service';
@Module({
  controllers: [UserController],
  providers: [UserService, RequestService, NotificationService],
  imports: [TypeOrmModule.forFeature([User, PromotionRequest, Notification])],
  exports: [UserService, NotificationService],
})
export class UserModule {}
