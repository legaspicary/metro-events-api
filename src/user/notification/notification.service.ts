import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
    constructor(@InjectRepository(Notification) private notificationRepo: Repository<Notification>) { }

    async create(title: string, message: string, recipient: User) {
        const notif = await this.notificationRepo.create({
            title,
            message,
            recipient
        })
        return this.notificationRepo.save(notif);
    }

    find(recipient: User) {
        return this.notificationRepo.find({ where: { recipient } });
    }

    remove(id: number) {
        return this.notificationRepo.delete(id);
    }
}
