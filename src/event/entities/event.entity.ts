import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
