import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  hasUpvoted: boolean;

  @Column()
  review: string;

  @ManyToOne(() => User, (user) => user.participants)
  user: User;

  @ManyToOne(() => Event, (event) => event.participants)
  event: Event;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
