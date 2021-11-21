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

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly participantService: ParticipantService,
    private readonly userService: UserService,
  ) { }

  @Post('/:id/participants')
  async joinEvent(@RequestUser() userInRequest, @Param('id') id: string) {
    const user = await this.userService.findOne(+userInRequest.id);
    const event = await this.eventService.findOne(+id);
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
  @Patch('/participants/:id')
  updateParticipantStatus(@Param('id') id: string, @Body() updateDto: UpdateParticipantDto) {
    return this.participantService.updateStatus(+id, updateDto);
  }

  @Roles(Role.Admin, Role.Organizer)
  @Delete('/participants/:id')
  removeParticipant(@Param('id') id: string) {
    return this.participantService.remove(+id);
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
    return this.eventService.create(user, createEventDto);
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
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
