import { Exclude } from 'class-transformer';
import { Participant } from '../../event/entities/participant.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from './notification.entity';
import { PromotionRequest } from './promtotion-request.entity';
import { Event } from '../../event/entities/event.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column()
  fullName: string;

  @OneToMany(() => Participant, (participant) => participant.owner, { cascade: true })
  participants?: Participant[];

  @OneToMany(() => Event, (event) => event.owner, { cascade: true })
  events?: Event[];

  @OneToMany(() => Notification, (notification) => notification.recipient, { cascade: true })
  notifications?: Notification[];

  @OneToMany(() => PromotionRequest, (request) => request.requestingUser, { cascade: true })
  requests?: PromotionRequest[];

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
