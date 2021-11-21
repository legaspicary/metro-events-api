import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateParticipantDto } from '../dto/update-participant.dto';
import { Event } from '../entities/event.entity';
import { Participant } from '../entities/participant.entity';

@Injectable()
export class ParticipantService {
    constructor(@InjectRepository(Participant) private participantRepo: Repository<Participant>) { }

    async joinEvent(user: User, event: Event) {
        const existingParticipant = await this.findOneByUser(user, event)
        if (!!existingParticipant && (existingParticipant.status === "approved" || existingParticipant.status === "pending")) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    errors: ['Already joined event or has pending request to join'],
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        const participant = this.participantRepo.create({
            status: "pending",
            hasUpvoted: false,
            owner: user,
            event,
            deletedAt: null
        });
        return this.participantRepo.save(participant);
    }

    findAllByUser(user: User) {
        return this.participantRepo.find({ where: { owner: user, status: "approved" }, relations: ["event"] })
    }

    findAllByEvent(event: Event, status: string) {
        if (!!status) {
            return this.participantRepo.find({ where: { event, status } })
        }
        return this.participantRepo.find({ where: { event }, relations: ["owner"] },)
    }

    findOneByUser(user: User, event: Event) {
        return this.participantRepo.findOne({ where: { owner: user, event }, order: { id: 'DESC' } })
    }

    async findOne(id: number) {
        const participant = await this.participantRepo.findOne(id, { relations: ["owner", "event"] });
        if (!!!participant) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    errors: ['Participant does not exist'],
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        return participant;
    }

    async update(user: User, id: number, updateDto: UpdateParticipantDto) {
        const { status, ...restOfDto } = updateDto;
        const participant = { ...await this.findOne(id), ...restOfDto };
        const errors = []
        if (participant.status !== "approved") {
            errors.push('User not a participant in this event');
        }
        if (participant.owner.id !== user.id) {
            errors.push('User does not own participation');
        }
        if (errors.length > 0) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    errors: errors,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        return this.participantRepo.save(participant);
    }

    async updateStatus(id: number, updateDto: UpdateParticipantDto) {
        const participant = await this.findOne(id);
        !!updateDto.status && (participant.status = updateDto.status)
        if (participant.status === "declined")
            return this.participantRepo.softRemove(participant);
        else
            return this.participantRepo.save(participant);
    }

    async remove(id: number) {
        const participant = await this.findOne(id);
        return this.participantRepo.softRemove(participant);
    }
}
