import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RequestUser } from '../user/decorators/request-user.decorator';
import { ParticipantService } from './participant/participant.service';
import { UserService } from '../user/user.service';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { QueryParticipantDto } from './dto/query-participant.dto';
import { NotificationService } from '../user/notification/notification.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly participantService: ParticipantService,
    private readonly userService: UserService,
    private readonly notifService: NotificationService
  ) { }

  @Post('/:id/participants')
  async joinEvent(@RequestUser() userInRequest, @Param('id') id: string) {
    const user = await this.userService.findOne(+userInRequest.id);
    const event = await this.eventService.findOne(+id);
    this.notifService.create(
      `A user wants to join ${event.name}`,
      `${user.fullName} has requested to join your event named ${event.name}`,
      event.owner
    )
    return this.participantService.joinEvent(user, event);
  }

  @Get('/:id/participants')
  async findAllEventParticipants(@Param('id') id: string, @Query() queryDto: QueryParticipantDto) {
    const event = await this.eventService.findOne(+id);
    return this.participantService.findAllByEvent(event, queryDto?.status);
  }

  @Get('/joined')
  async findUserEvents(@RequestUser() userInRequest) {
    const user = await this.userService.findOne(+userInRequest.id);
    return this.participantService.findAllByUser(user);
  }

  @Roles(Role.Admin, Role.Organizer)
  @Patch('/participant-status/:id')
  async updateParticipantStatus(@Param('id') id: string, @Body() updateDto: UpdateParticipantDto) {
    const participant = await this.participantService.updateStatus(+id, updateDto);
    this.notifService.create(
      `${participant.event.name} request`,
      `Your request for ${participant.event.name} has been ${participant.status}`,
      participant.owner
    )
    return participant;
  }

  @Roles(Role.Admin, Role.Organizer)
  @Delete('/participants/:id')
  async removeParticipant(@Param('id') id: string) {
    const participant = await this.participantService.remove(+id);
    this.notifService.create(
      `${participant.event.name} participation update`,
      `You have been removed from the event ${participant.event.name}`,
      participant.owner
    )
    return participant;
  }

  @Patch('/participants/:id')
  async updateParticipant(@RequestUser() userInRequest, @Param('id') id: string, @Body() updateDto: UpdateParticipantDto) {
    const user = await this.userService.findOne(+userInRequest.id);
    return this.participantService.update(user, +id, updateDto);
  }

  @Roles(Role.Admin, Role.Organizer)
  @Post()
  async create(@RequestUser() userInRequest, @Body() createEventDto: CreateEventDto) {
    const user = await this.userService.findOne(+userInRequest.id);
    const users = await this.userService.findAll();
    const event = await this.eventService.create(user, createEventDto);
    users.forEach(recipient => {
      if (recipient.id != event.owner.id) {
        this.notifService.create(
          `Upcoming event: ${event.name}`,
          `There is an upcoming event, you might want to check it out!`,
          recipient
        )
      }

    })
    return event;
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Roles(Role.Admin, Role.Organizer)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Roles(Role.Admin, Role.Organizer)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const event = await this.eventService.findOne(+id);
    const participants = await this.participantService.findAllByEvent(event, null);
    participants.forEach(participant => {
      this.notifService.create(
        `${event.name} has been cancelled`,
        `The event has been cancelled.`,
        participant.owner,
      )
    })
    return await this.eventService.remove(+id);
  }
}
