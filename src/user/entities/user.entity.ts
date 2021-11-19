import { Exclude } from 'class-transformer';
import { Participant } from '../../event/entities/participant.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToMany(() => Participant, (participant) => participant.user, { cascade: true })
  participants?: Participant[];

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
