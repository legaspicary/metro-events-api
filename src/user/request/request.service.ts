import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateRequestDto } from '../dto/update-request';
import { PromotionRequest } from '../entities/promtotion-request.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class RequestService {
    constructor(
        @InjectRepository(PromotionRequest) private requestRepo: Repository<PromotionRequest>,
        @InjectRepository(User) private userRepo: Repository<User>
    ) { }

    async create(user: User, createRequestDto: CreateRequestDto) {
        if ((await this.findByUser(user)).length > 0)
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    errors: ['Only one request can be sent per user'],
                },
                HttpStatus.BAD_REQUEST,
            );
        const request = this.requestRepo.create(createRequestDto);
        request.requestingUser = user;
        return this.requestRepo.save(request);
    }

    async findOne(id: number) {
        const request = await this.requestRepo.findOne(id, { relations: ["requestingUser"] });
        if (!!!request) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    errors: ['Request not found'],
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        return request;
    }

    async findByUser(user: User) {
        return this.requestRepo.find({ where: { requestingUser: user, isApproved: false } });
    }

    findAll() {
        return this.requestRepo.find();
    }

    async update(id: number, updateRequestDto: UpdateRequestDto) {
        const request = await this.findOne(id);
        const updatedRequest: PromotionRequest = {
            ...request,
            ...updateRequestDto
        }

        if (!updatedRequest.isApproved)
            return this.requestRepo.softRemove(updatedRequest);
        else {
            const user = request.requestingUser;
            user.role = request.promoteTo;
            await this.userRepo.save(user);
        }
        return this.requestRepo.save(updatedRequest);
    }
}
