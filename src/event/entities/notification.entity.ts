import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Notification {
    @Column()
    title: string;

    @Column()
    message: string;

    @ManyToOne(() => User, (user) => user.notifications)
    recipient: User;

    @Column({ default: false })
    isViewed: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}