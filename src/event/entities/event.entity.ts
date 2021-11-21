import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Participant } from './participant.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @OneToMany(() => Participant, (participant) => participant.event, { cascade: true })
  participants?: Participant[];

  @ManyToOne(() => User, (user) => user.events)
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
