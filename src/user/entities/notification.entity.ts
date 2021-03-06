import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    message: string;

    @ManyToOne(() => User, (user) => user.notifications)
    recipient: User;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}