import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestService } from './request/request.service';
import { RequestUser } from './decorators/request-user.decorator';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request';
import { NotificationService } from './notification/notification.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly requestService: RequestService,
    private readonly notifService: NotificationService
  ) { }

  @Get('/notifications')
  async findNotifications(@RequestUser() userInRequest) {
    const user = await this.userService.findOne(userInRequest.id);
    return this.notifService.find(user);
  }

  @Delete('/notifications/:id')
  async removeNotification(@Param('id') id: string) {
    return this.notifService.remove(+id);
  }


  @Roles(Role.User)
  @Post('/promotion-requests')
  async createRequest(@RequestUser() userInRequest, @Body() createRequestDto: CreateRequestDto) {
    const user = await this.userService.findOne(userInRequest.id);
    const users = await this.findAll();
    const admins = users.filter(val => val.role === "admin");
    const request = await this.requestService.create(user, createRequestDto);
    admins.forEach(admin => {
      this.notifService.create(
        `${user.fullName} promotion request`,
        `${user.fullName} has requested to be promoted to ${request.promoteTo}.`,
        admin,
      )
    })
    return request
  }

  @Roles(Role.Admin)
  @Get('/promotion-requests')
  findAllRequest() {
    return this.requestService.findAll();
  }

  @Roles(Role.Admin)
  @Patch('/promotion-requests/:id')
  async updateRequest(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    const request = await this.requestService.update(+id, updateRequestDto);
    this.notifService.create(
      `Promotion request`,
      `Your request to be promoted to ${request.promoteTo} has been ${request.isApproved ? "approved" : "declined"}.`,
      request.requestingUser,
    );
    return request;
  }

  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @Roles(Role.Admin, Role.Organizer)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
