import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PromotionRequest } from './entities/promtotion-request.entity';
import { RequestService } from './request/request.service';

@Module({
  controllers: [UserController],
  providers: [UserService, RequestService],
  imports: [TypeOrmModule.forFeature([User, PromotionRequest])],
  exports: [UserService],
})
export class UserModule {}
