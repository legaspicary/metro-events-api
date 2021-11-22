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
import { Exclude } from 'class-transformer';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Exclude()
  @Column()
  hasUpvoted: boolean;

  @Column({ default: null })
  review: string;

  @ManyToOne(() => User, (user) => user.participants)
  owner: User;

  @ManyToOne(() => Event, (event) => event.participants)
  event: Event;

  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
