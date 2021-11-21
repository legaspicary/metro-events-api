import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(@InjectRepository(Event) private eventRepo: Repository<Event>) { }
  create(owner: User, createEventDto: CreateEventDto) {
    const event = this.eventRepo.create(createEventDto);
    event.owner = owner;
    return this.eventRepo.save(event);
  }

  async findAll() {
    const events = await this.eventRepo.find({
      order: {
        createdAt: "DESC"
      },
      relations: ["owner", "participants"]
    });
    events.forEach(event => {
      let upvotes = 0;
      event.participants.forEach(participant => {
        if (participant.hasUpvoted) {
          upvotes++;
        }
      })
      event.upvotes = upvotes;
    })
    return events;
  }

  async findOne(id: number) {
    const event = await this.eventRepo.findOne(id, {
      relations: ["owner", "participants"]
    });
    if (!!!event) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errors: ['Event not found'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let upvotes = 0;
    event.participants.forEach(participant => {
      if (participant.hasUpvoted) {
        upvotes++;
      }
    })
    event.upvotes = upvotes;
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);
    const updatedEvent = { ...event, ...updateEventDto }
    return this.eventRepo.save(updatedEvent);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    return this.eventRepo.softRemove(event);
  }
}
